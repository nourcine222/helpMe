const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
        'Clothing',
        'Electronics',
        'Furniture',
        'Books',
        'Toys',
        'Household Items',
        'Sports Equipment',
        'Jewelry',
        'Tools',
        'Appliances',
        'Other',// Adjusted enum to be consistent with 'rejected'
    ],},
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected','completed', 'shut_down'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  media: [ // New field for multiple media items
    {
      type: String, // URL of the media (image/video)
    },
  ],
  requests: [
    {
      requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reports: [
    {
      reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'], // Status options for reports
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ], 
  selectedRecipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  saves: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;