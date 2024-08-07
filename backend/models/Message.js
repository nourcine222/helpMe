const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: [ // New field for multiple media items (images/videos)
    {
      type: String, // URL of the media (image/video)
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatschema = new mongoose.Schema({
  members: [
{
  type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    
}
  ],
  messages:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  }]

})
const Chat = mongoose.model('Chat', chatschema);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message , Chat;
