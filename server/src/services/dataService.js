/*
Import packages
*/
const fs = require('fs');
const { url } = require('inspector');
const path = require('path');
const { send } = require('process');
const { v4: uuidv4 } = require('uuid');

/*
Import custom packages
*/
const { HTTPError, convertArrayToPagedObject } = require('../utils');

/*
File paths
*/
const filePathMessages = path.join(__dirname, '..', 'data', 'messages.json');
const filePathMatches = path.join(__dirname, '..', 'data', 'matches.json');
const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');

/*
Read data
*/
const readDataFromUsersFile = () => {
  const data = fs.readFileSync(filePathUsers, { encoding: 'utf-8', flag: 'r' });
  const users = JSON.parse(data);
  return users;
};

const readDataFromMessagesFile = () => {
  const data = fs.readFileSync(filePathMessages, { encoding: 'utf-8', flag: 'r' });
  const messages = JSON.parse(data);
  return messages;
};

const readDataFromMatchesFile = () => {
  const data = fs.readFileSync(filePathMatches, { encoding: 'utf-8', flag: 'r' });
  const matches = JSON.parse(data);
  return matches;
};

/*
Get all users
*/
const getUsers = () => {
  try {
    // Read the users.json file
    const users = readDataFromUsersFile();
    return users;
  } catch (error) {
    throw new HTTPError("Can't get users", 500);
  }
};

/*
Get a specific user
*/
const getUserById = (userId) => {
  try {
    // Read the users.json file
    const users = readDataFromUsersFile();
    // Find a specific user
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new HTTPError(`Cant't find the user with id ${userId}!`, 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

/*
Get all messages
*/
const getMessages = () => {
  try {
    // Read the messages.json file
    const messages = readDataFromMessagesFile();
    
    return messages;
  } catch (error) {
    throw new HTTPError("Can't get messages", 500);
  }
};

/*
Get a specific message
*/
const getMessageById = (messageId) => {
  try {
    // Read the users.json file
    const messages = readDataFromMessagesFile();
    // Find a specific user
    const message = messages.find(m => m.id === messageId);
    if (!message) {
      throw new HTTPError(`Cant't find the user with id ${messageId}!`, 404);
    }
    return message;
  } catch (error) {
    throw error;
  }
};

/*
Get incoming & outgoing messages for a specific user
*/
const getMessagesFromUser = (userId, friendId, type) => {
  try {
    // Read the messages.json file
    const messages = readDataFromMessagesFile();
    // Find messages for a specific user
    let selectedUser = messages.filter(message => message.senderId === userId || message.receiverId === userId);
    if (type === 'received') {
      selectedUser = selectedUser.filter(message => message.receiverId === userId);
    } else if (type === 'sent') {
      selectedUser = selectedUser.filter(message => message.senderId === userId);
    } else if (type === 'conversation') {
      selectedUser = selectedUser.filter(message => (message.senderId === userId && message.receiverId === friendId) || (message.senderId === friendId && message.receiverId === userId));
    }
    if (!selectedUser) {
      throw new HTTPError(`Can't get messages for the user with userId ${userId}`, 404);
    }
    return selectedUser;
  } catch (error) {
    throw error;
  }
};

/*
Create a new message
*/
const createMessage = (message) => {
  try {
    // Read the messages.json file
    const messages = readDataFromMessagesFile();
    // Create a message
    const messageToCreate = {
      ...message,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    messages.push(messageToCreate);
    // Write messages array to the messages.json file
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));
    return messageToCreate;
  } catch (error) {
    throw new HTTPError('Cant\'t create a new post!', 501);
  }
};

/*
Get all matches
*/
const getMatches = () => {
  try {
    // Read the matches.json file
    const matches = readDataFromMatchesFile();

    return matches;
  } catch (error) {
    throw new HTTPError("Can't get matches", 500);
  }
};

/*
Get all matches for a specific user
*/
const getMatchesFromUser = (userId) => {
  try {
    // Read the matches.json file
    const matches = readDataFromMatchesFile();
    // Find matches for a specific user
    const userMatches = matches.filter(match => match.userId === userId);
    // if (!userMatches) {
    //   userMatches = matches.filter(match => match.userId !== userId);
    // }
    return userMatches;
  } catch (error) {
    throw error;
  }
};

// Export all the methods of the data service
module.exports = {
  getUsers,
  getUserById,
  getMessages,
  getMessageById,
  getMessagesFromUser,
  createMessage,
  getMatches,
  getMatchesFromUser,
};
