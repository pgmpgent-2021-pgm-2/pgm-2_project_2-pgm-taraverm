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
      this.$conversationBox = document.querySelector('.conversation');
      this.$matchesBox = document.querySelector('.matches');
    },
    registerListeners () {
      this.$usersBox.addEventListener('click', ev => {
        const userId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        this.fetchReceivedMessagesFromUser(userId);
        this.fetchSentMessagesFromUser(userId);
        this.setActiveUser(userId);
      })
      this.$incomingMessages.addEventListener('click', ev => {
        const messageId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        this.setActiveCommunity(userId);
      })
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
      this.setActiveUser(userId);
    },
    setActiveUser (userId) {
      this.currentUserId = userId;
      const $selectedUser = this.$usersBox.querySelector('.selected');
      if ($selectedUser) {
        $selectedUser.classList.remove('selected');
      }
      this.$usersBox.querySelector(`.user > a[data-id="${userId}"]`).parentNode.classList.add('selected');
    },
    async fetchReceivedMessagesFromUser (userId) {
      this.receivedMessages = await this.tinderApi.getReceivedMessagesFromUser(userId);
      this.$incomingMessages.innerHTML = this.receivedMessages.map(message => `
      <li class="incoming-message">
        <a href="#" data-id="${message.id}">
          <h3>Naam</h3>
          <p>${message.createdAt}</p>
          <p>${message.message}</p>
        </a>
      </li>
      `).join('');
      // ID van het eerste bericht opvragen
      const messageId = this.messages[0].id;
      console.log(messagesId);
      this.setActiveMessage(messagesId);
    },
    async fetchSentMessagesFromUser (userId) {
      this.sentMessages = await this.tinderApi.getSentMessagesFromUser(userId);
      this.$outgoingMessages.innerHTML = this.sentMessages.map(message => `
      <li class="outgoing-message">
        <a href="#" data-id="${message.id}">
          <h3>Naam</h3>
          <p>${message.createdAt}</p>
          <p>${message.message}</p>
        </a>
      </li>
      `).join('');
    },
    setActiveMessage (messageId) {
      this.currentMessageId = messageId;
      const $selectedMessage = this.$incomingMessages.querySelector('.selected');
      if ($selectedMessage) {
        $selectedMessage.classList.remove('selected');
      }
      this.$incomingMessages.querySelector(`.incoming-message > a[data-id="${messageId}"]`).parentNode.classList.add('selected');
    }
  }
  app.initialize();
})();