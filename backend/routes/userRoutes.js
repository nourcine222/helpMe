const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getUsers);

// Get a user by ID
router.get('/User/:id', userController.getUserById);

// Update user information
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

// Report a user
router.post('/:id/report', userController.reportUser);

// Get reported users
router.get('/reported', userController.getReportedUsers);

// Get user rankings
router.get('/ranking', userController.getUserRanking);

// Get users by location
router.get('/location', userController.getUsersByLocation);

// Get users by availability
router.get('/availability', userController.getUsersByAvailability);

// Get users by age
router.get('/age', userController.getUsersByAge);

// Get users by joined date
router.get('/joined-at', userController.getUsersByJoinedAt);

// Get users by role
router.get('/role', userController.getUsersByRole);

// Get users by gender
router.get('/gender', userController.getUsersByGender);

// Get users by anonymity
router.get('/anonymity', userController.getUsersByAnonymity);

// Get users by country
router.get('/country', userController.getUsersByCountry);

// Get users by state and country
router.get('/state-country', userController.getUsersByStateAndCountry);

// Get users by interest
router.get('/interest', userController.getUsersByInterest);

// Update user's profile photo
router.put('/:id/profile-photo', userController.updateUserProfilePhoto);

// Get user's profile photo
router.get('/:id/profile-photo', userController.getUserProfilePhoto);

// Delete user's profile photo
router.delete('/:id/profile-photo', userController.deleteUserProfilePhoto);

// Update user's background image
router.put('/:id/background-image', userController.updateUserBackgroundImage);

// Get user's background image
router.get('/:id/background-image', userController.getUserBackgroundImage);

// Delete user's background image
router.delete('/:id/background-image', userController.deleteUserBackgroundImage);

// Update user's gender
router.put('/:id/gender', userController.updateUserGender);

// Update user's anonymity
router.put('/:id/anonymity', userController.updateUserAnonymity);

// Update user's location
router.put('/:id/location', userController.updateUserLocation);

// Update user's interests
router.put('/:id/interests', userController.updateUserInterests);

// Update user's birthday
router.put('/:id/birthday', userController.updateUserBirthday);

module.exports = router;
