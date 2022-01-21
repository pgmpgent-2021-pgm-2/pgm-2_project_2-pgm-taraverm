const TINDER_BASE_PATH = 'http://localhost:8080/api';

function TinderApi () {
  this.getUsers = async () => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error has occured!', error);
    }   
  };

  this.getReceivedMessagesFromUser = async (userId) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users/${userId}/messages?type=received`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error has occured!', error);
    }  
  };

  this.getSentMessagesFromUser = async (userId) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users/${userId}/messages?type=sent`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error has occured!', error);
    }
  };

  this.getConversationBetweenUsers = async (userId, friendId) => {
  };

  this.addMessageBetweenUsers = async (userId, friendId, message) => {
  };

  this.getMatchesForUser = async (userId) => {
  };

  this.addMatch = async (userId, friendId, rating) => {
  };
}