const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import the User model

// Register a new user
router.post('/register', async (req, res) => {
  const { name, lastName, email, password } = req.body;

  // Basic validation
  if (!name || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Name, last name, email, and password are required.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const user = new User({
      name,
      lastName,
      email,
      password: hashedPassword, // Use hashed password
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Login a user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication failed', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    req.logIn(user, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed', error: err.message });
      }

      // Include the role in the response
      const userDetails = await User.findById(user._id).select('name role email'); // Adjust fields as needed

      res.json({ 
        message: 'Login successful', 
        user: userDetails,
        role: userDetails.role // Include role in the response
      });
    });
  })(req, res, next);
});

// Logout a user
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    res.json({ message: 'Logout successful' });
  });
});

module.exports = router;
