const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController'); // Ensure this path is correct

// Check that the functions are correctly defined in messageController
console.log('Message Controller:', messageController);

// Define your routes
router.post('/', messageController.createMessage); // Ensure this function is defined
router.get('/', messageController.getAllMessages); // Ensure this function is defined
router.get('/:id', messageController.getMessageById); // Ensure this function is defined
router.delete('/:id', messageController.deleteMessage); // Check if this function is defined

module.exports = router;
