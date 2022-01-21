/*
Import packages
*/
const fs = require('fs');
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
Get incoming & outgoing messages for a specific user
*/
const getMessagesFromUser = (userId, type) => {
  try {
    // Read the messages.json file
    const messages = readDataFromMessagesFile();
    // Find messages for a specific user
    const selectedUser = messages.filter(message => message.senderId === userId || message.receiverId === userId);
    if (type === 'received') {
      selectedUser.filter(message => message.receiverId === userId);
    } if (type === 'sent') {
      selectedUser.filter(message => message.senderId === userId);
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

// Export all the methods of the data service
module.exports = {
  getMessages,
  getMatches,
  getMessagesFromUser,
  getUsers,
};
