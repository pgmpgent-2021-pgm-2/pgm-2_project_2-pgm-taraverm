/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all messages
*/
const getMessages = (req, res, next) => {
  try {
    // Get messages from dataService
    const messages = dataService.getMessages();
    // Send response
    res.status(200).json(messages);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Get a specific message
*/
const getMessageById = (req, res, next) => {
  try {
    // Get messageId parameter
    const { messageId } = req.params;
    // Get specific user from service
    const user = dataService.getMessageById(messageId);
    // Send response
    res.status(200).json(user);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Get messages from a specific user
*/
const getMessagesFromUserById = (req, res, next) => {
  try {
    // Get userId & type parameter from the url
    const { userId } = req.params;
    const { type, friendId } = req.query;
    // Get messages from service
    const messages = dataService.getMessagesFromUser(userId, friendId, type);
    // Send response
    res.status(200).json(messages);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Create a new message
*/
const createMessage = (req, res, next) => {
  try {
    const message = req.body;
    const createdMessage = dataService.createMessage(message);
    res.status(201).json(createdMessage);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Update a specific message
*/
const updateMessage = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Delete a specific message
*/
const deleteMessage = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

// Export the action methods = callbacks
module.exports = {
  createMessage,
  deleteMessage,
  getMessages,
  getMessageById,
  getMessagesFromUserById,
  updateMessage,
};
