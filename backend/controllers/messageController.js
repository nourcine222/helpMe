const Message = require('../models/Message'); // Import the Message model

// Create a new message
exports.createMessage = async (req, res) => {
    try {
        const messageData = req.body;
        const newMessage = new Message(messageData);
        await newMessage.save();
        res.status(201).json({ message: 'Message created successfully', message: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error creating message', error });
    }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
    const userId = req.body.userId;
    try {
        const messages = await Message.find({
            $or: [{ senderId: userId }, { recipientId: userId }]
        }).populate('senderId recipientId', 'name profilePhoto').exec(); // Populating sender and recipient details
 res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

// Get a message by ID
exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching message', error });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error });
    }
};
