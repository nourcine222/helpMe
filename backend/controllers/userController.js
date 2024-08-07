const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
  const { name, lastName, email, password, ...otherData } = req.body; // Adjust fields according to your model

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

    // Create a new user instance
    const user = new User({
      name,
      lastName,
      email,
      password, // Here we assume password hashing is handled in the model
      ...otherData // Add any additional data if required
    });

    // Save the user to the database
    await user.save();

    // Respond with the created user (excluding password)
    res.status(201).json({ message: 'User registered successfully', user: { ...user._doc, password: undefined } });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    
    // Handle specific errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }

    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from response
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update user information
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true }).select('-password'); // Exclude password from response
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Report a user
exports.reportUser = async (req, res) => {
  const { id } = req.params;
  const { userId, reason } = req.body; // Assuming report data is sent in the body
  try {
    const user = await User.findById(
      id
    );
   
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.reports.push({ userId, reason });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error reporting user', error });
  }
};

// Get reported users
exports.getReportedUsers = async (req, res) => {
  try {
    const reportedUsers = await User.find({ reports: { $exists: true, $not: { $size: 0 } } });
    res.status(200).json(reportedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reported users', error });
  }
};

// Get user rankings
exports.getUserRanking = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ xpPoints: -1 }); // Sort by xpPoints in descending order

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user rankings:', error); // Log the error
    res.status(500).json({ message: 'Error fetching user rankings', error });
  }
};

// Get users by location
exports.getUsersByLocation = async (req, res) => {
  const { country, state, address } = req.query; // Get location from query parameters
  try {
    const users = await User.find({
      'location.country': country,
      'location.state': state,
      'location.address': address,
    }).select('name lastName email location');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by location', error });
  }
};

// Get users by availability
exports.getUsersByAvailability = async (req, res) => {
  const { availability } = req.query; // Get availability from query parameters
  try {
    const users = await User.find({ availability })
      .select('name lastName email availability'); // Select relevant fields

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by availability', error });
  }
};

// Get users by age
exports.getUsersByAge = async (req, res) => {
  const { minAge, maxAge } = req.query; // Get age range from query parameters
  try {
    const minBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() - maxAge));
    const maxBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() - minAge));
    const users = await User.find({
      birthday: { $gte: minBirthDate, $lte: maxBirthDate }
    }).select('name lastName email birthday'); // Select relevant fields

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by age', error });
  }
};

// Get users by joined date
exports.getUsersByJoinedAt = async (req, res) => {
  const { startDate, endDate } = req.query; // Get date range from query parameters
  try {
    const users = await User.find({
      joinedAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).select('name lastName email joinedAt'); // Select relevant fields

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by joined date', error });
  }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
  const { role } = req.query; // Get role from query parameters
  try {
    const users = await User.find({ role })
      .select('name lastName email role'); // Select relevant fields

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by role', error });
  }
};
// Get users by gender
exports.getUsersByGender = async (req, res) => {
  const { gender } = req.query;
  try {
    const users = await User.find({ gender }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by gender', error });
  }
};

// Get users by anonymity
exports.getUsersByAnonymity = async (req, res) => {
  const { isAnonymous } = req.query;
  try {
    const users = await User.find({ isAnonymous }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by anonymity', error });
  }
};

// Get users by country
exports.getUsersByCountry = async (req, res) => {
  const { country } = req.query;
  try {
    const users = await User.find({ 'location.country': country }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by country', error });
  }
};

// Get users by state and country
exports.getUsersByStateAndCountry = async (req, res) => {
  const { state, country } = req.query;
  try {
    const users = await User.find({ 'location.state': state, 'location.country': country }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status500.json({ message: 'Error fetching users by state and country', error });
  }
};

// Get users by interest
exports.getUsersByInterest = async (req, res) => {
  const { interest } = req.query; // Get interest from query parameters
  try {
    const users = await User.find({ interests: interest })
      .select('name lastName email interests') // Select relevant fields
      .exec();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by interest', error });
  }
};
const cloudinary = require('../config/cloudinary');
//Update user's profile photo
exports.updateUserProfilePhoto = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    // Upload the new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_photos', // Change the folder name as needed
    });

    // Update the user's profile photo URL in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePhoto: result.secure_url },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile photo', error });
  }
};

// Get user's profile photo
exports.getUserProfilePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('profilePhoto');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ profilePhoto: user.profilePhoto });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile photo', error });
  }
};

// Delete user's profile photo
exports.deleteUserProfilePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('profilePhoto');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Extract the public ID from the URL to delete from Cloudinary
    const publicId = user.profilePhoto.split('/').pop().split('.')[0];

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update the user's profile photo URL in the database to null
    user.profilePhoto = null;
    await user.save();

    res.status(200).json({ message: 'Profile photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile photo', error });
  }
};

// Update user's background image
exports.updateUserBackgroundImage = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    // Upload the new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'background_images', // Change the folder name as needed
    });

    // Update the user's background image URL in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { backgroundImage: result.secure_url },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating background image', error });
  }
};

// Get user's background image
exports.getUserBackgroundImage = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('backgroundImage');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ backgroundImage: user.backgroundImage });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user background image', error });
  }
};

// Delete user's background image
exports.deleteUserBackgroundImage = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('backgroundImage');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Extract the public ID from the URL to delete from Cloudinary
    const publicId = user.backgroundImage.split('/').pop().split('.')[0];

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update the user's background image URL in the database to null
    user.backgroundImage = null;
    await user.save();

    res.status(200).json({ message: 'Background image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting background image', error });
  }
};
// Update user's gender
exports.updateUserGender = async (req, res) => {
  const { id } = req.params;
  const { gender } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { gender },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating gender', error });
  }
};

// Update user's anonymity
exports.updateUserAnonymity = async (req, res) => {
  const { id } = req.params;
  const { isAnonymous } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isAnonymous },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating anonymity', error });
  }
};

// Update user's location
exports.updateUserLocation = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { location },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error });
  }
};

// Update user's interests
exports.updateUserInterests = async (req, res) => {
  const { id } = req.params;
  const { interests } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { interests },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating interests', error });
  }
};

// Update user's birthday
exports.updateUserBirthday = async (req, res) => {
  const { id } = req.params;
  const { birthday } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { birthday },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating birthday', error });
  }
};

// Update user's availability
exports.updateUserAvailability = async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { availability },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability', error });
  }
};

// Update user's role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
};

// Update user's XP points
exports.updateUserXPPoints = async (req, res) => {
  const { id } = req.params;
  const { xpPoints } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { xpPoints },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating XP points', error });
  }
};
