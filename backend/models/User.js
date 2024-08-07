const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // User's first name
  },
  lastName: {
    type: String,
    required: true, // User's last name
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }, phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'donor', 'sponsor', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePhoto: {
    type: String,
    default : "https://res.cloudinary.com/dkq3vlps8/image/upload/v1722650427/i50vceflan1tnbk6rur7.webp" // URL to the profile photo
  },
  backgroundImage: {
    type: String, // URL to the background image
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  xpPoints: {
    type: Number,
    default: 0,
  },
  birthday: {
    type: Date,
  },
  location: {
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  bio :{
    type: String,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  anonymity: {
    type: Boolean,
    default: false,
  },
  interests: {
    type: [String], // Array of interests
  },
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
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Add a method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
