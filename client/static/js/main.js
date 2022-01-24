(() => {
  const app = {
    initialize () {
      this.tinderApi = new TinderApi();
      this.users = [];
      this.currentUserId = null;
      this.currentMessageId = null;
      this.cacheElements();
      this.registerListeners();
      this.fetchUsers();
    },
    cacheElements () {
      this.$usersBox = document.querySelector('.users-box');
      this.$incomingMessages = document.querySelector('.incoming-messages');
      this.$outgoingMessages = document.querySelector('.outgoing-messages');
      this.$conversationBox = document.querySelector('.conversation-messages');
      this.$chatbox = document.querySelector('.chatbox');
      this.$matchesBox = document.querySelector('.matches');
    },
    registerListeners () {
      this.$usersBox.addEventListener('click', ev => {
        const userId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        this.fetchReceivedMessagesFromUser(userId);
        this.fetchSentMessagesFromUser(userId);
        this.setActiveUser(userId);
      });
      this.$incomingMessages.addEventListener('click', ev => {
        const messageId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        // this.fetchConversationBetweenUsers(userId, friendId);
        this.setActiveMessage(messageId);
      });
      this.$chatbox.addEventListener('submit', async ev => {
        ev.preventDefault();
        const message = {
          senderId: this.currentUserId,
          receiverId: this.currentFriendId,
          message: ev.target['txtMessage'].value,
        }
        await this.tinderApi.addMessageBetweenUsers(message);
      });
      this.$matchesBox.addEventListener('click', ev => {
        const matchId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
      });
    },
    async fetchUsers () {
      this.users = await this.tinderApi.getUsers();
      this.$usersBox.innerHTML = this.users.map(user => `
      <li class="user">
        <a href="#" data-id="${user.id}">
          <img src="${user.picture.thumbnail}" alt="">
          <p>${user.firstName} ${user.lastName}</p>
        </a>
      </li>
      `).join('');
      // ID van de eerste gebruiker opvragen
      const userId = this.users[0].id;
      this.fetchReceivedMessagesFromUser(userId);
      this.fetchSentMessagesFromUser(userId);
      this.fetchMatchesFromUser(userId);
      this.setActiveUser(userId);
    },
    setActiveUser (userId) {
      this.currentUserId = userId;
      const $selectedUser = this.$usersBox.querySelector('.selected');
      if ($selectedUser) {
        $selectedUser.classList.remove('selected');
      }
      this.$usersBox.querySelector(`.user > a[data-id="${userId}"]`).parentNode.classList.add('selected');

      this.fetchMatchesFromUser(userId);
    },
    async fetchReceivedMessagesFromUser (userId) {
      const receivedMessages = await this.tinderApi.getReceivedMessagesFromUser(userId);
      // const user = this.users.find(user => friendId === user.id);
      this.$incomingMessages.innerHTML = receivedMessages.map(message => `
      <li class="incoming-message">
        <a href="#" data-id="${message.id}">
          <h3>
            <span>${message.id}</span>
            <span class="date">${moment(message.createdAt).fromNow()}</span>
          </h3>
          <p>${message.message}</p>
        </a>
      </li>
      `).join('');
      // ID van het eerste bericht opvragen
      const messageId = receivedMessages[0].id;
      const friendId = receivedMessages[0].senderId;
      this.setActiveMessage(messageId);
      this.fetchConversationBetweenUsers(userId, friendId);
      document.querySelector('.inbox-amount').innerText = receivedMessages.length;
    },
    async fetchSentMessagesFromUser (userId) {
      const sentMessages = await this.tinderApi.getSentMessagesFromUser(userId);
      // const user = this.users.find(user => user.id === sentMessages[0].receiverId);
      this.$outgoingMessages.innerHTML = sentMessages.map(message => `
      <li class="outgoing-message">
        <a href="#" data-id="${message.id}">
          <h3>
            <span>${message.id}<span>
            <span class="date">${moment(message.createdAt).fromNow()}</span>
          </h3>
          <p>${message.message}</p>
        </a>
      </li>
      `).join('');
      document.querySelector('.outbox-amount').innerText = sentMessages.length;
    },
    setActiveMessage (messageId, friendId) {
      this.currentMessageId = messageId;
      this.currentFriendId = friendId;
      const $selectedMessage = this.$incomingMessages.querySelector('.selected');
      if ($selectedMessage) {
        $selectedMessage.classList.remove('selected');
      }
      this.$incomingMessages.querySelector(`.incoming-message > a[data-id="${messageId}"]`).parentNode.classList.add('selected');
    },
    async fetchConversationBetweenUsers (userId, friendId) {
      this.conversation = await this.tinderApi.getConversationBetweenUsers(userId, friendId);
      this.$conversationBox.innerHTML = this.conversation.map(m => `
      <div class="chatbox-message">
        <p class="date">${moment(m.createdAt).format('LLL')}</p>
        <p>${m.message}</p>
      </div>
      `).join('');
    },
    async fetchMatchesFromUser (userId) {
      const matches = await this.tinderApi.getMatchesForUser(userId);
      // const user = this.users.find(user => user.id === matches[0].friendId);
      this.$matchesBox.innerHTML = matches.map(match => `
      <li class="match">
        <img>
        <p>${match.userId}</p>
        <p>${match.rating}</p>
      </li>
      `).join('');
    },
  }
  app.initialize();
})();