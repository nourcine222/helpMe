const cloudinary = require('../config/cloudinary'); // Adjust the path as necessary
const BlogPost = require('../models/BlogPost'); // Adjust the path as necessary
const Donation = require('../models/Donation'); // Adjust the path as necessary
const Message = require('../models/Message'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary

// Upload single media for BlogPost
exports.uploadBlogPostMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const mediaUrl = result.secure_url;

    const updatedDocument = await BlogPost.findByIdAndUpdate(
      id,
      { $push: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload multiple media for BlogPost
exports.uploadMultipleBlogPostMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await BlogPost.findByIdAndUpdate(
      id,
      { $push: { media: { $each: mediaUrls } } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get media for BlogPost
exports.getBlogPostMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await BlogPost.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document.media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update media for BlogPost
exports.updateBlogPostMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await BlogPost.findByIdAndUpdate(
      id,
      { media: mediaUrls },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status500().json({ error: error.message });
  }
};

// Delete single media for BlogPost
exports.deleteBlogPostMedia = async (req, res) => {
  const { id, mediaUrl } = req.params;

  try {
    const updatedDocument = await BlogPost.findByIdAndUpdate(
      id,
      { $pull: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Repeat similar functions for Donation, Message, and User models

// Upload single media for Donation
exports.uploadDonationMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const mediaUrl = result.secure_url;

    const updatedDocument = await Donation.findByIdAndUpdate(
      id,
      { $push: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload multiple media for Donation
exports.uploadMultipleDonationMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await Donation.findByIdAndUpdate(
      id,
      { $push: { media: { $each: mediaUrls } } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get media for Donation
exports.getDonationMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Donation.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document.media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update media for Donation
exports.updateDonationMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await Donation.findByIdAndUpdate(
      id,
      { media: mediaUrls },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete single media for Donation
exports.deleteDonationMedia = async (req, res) => {
  const { id, mediaUrl } = req.params;

  try {
    const updatedDocument = await Donation.findByIdAndUpdate(
      id,
      { $pull: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload single media for Message
exports.uploadMessageMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const mediaUrl = result.secure_url;

    const updatedDocument = await Message.findByIdAndUpdate(
      id,
      { $push: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload multiple media for Message
exports.uploadMultipleMessageMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await Message.findByIdAndUpdate(
      id,
      { $push: { media: { $each: mediaUrls } } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get media for Message
exports.getMessageMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Message.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document.media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update media for Message
exports.updateMessageMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await Message.findByIdAndUpdate(
      id,
      { media: mediaUrls },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete single media for Message
exports.deleteMessageMedia = async (req, res) => {
  const { id, mediaUrl } = req.params;

  try {
    const updatedDocument = await Message.findByIdAndUpdate(
      id,
      { $pull: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload single media for User
exports.uploadUserMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const mediaUrl = result.secure_url;

    const updatedDocument = await User.findByIdAndUpdate(
      id,
      { $push: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload multiple media for User
exports.uploadMultipleUserMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await User.findByIdAndUpdate(
      id,
      { $push: { media: { $each: mediaUrls } } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get media for User
exports.getUserMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await User.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document.media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update media for User
exports.updateUserMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const mediaUrls = results.map(result => result.secure_url);

    const updatedDocument = await User.findByIdAndUpdate(
      id,
      { media: mediaUrls },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete single media for User
exports.deleteUserMedia = async (req, res) => {
  const { id, mediaUrl } = req.params;

  try {
    const updatedDocument = await User.findByIdAndUpdate(
      id,
      { $pull: { media: mediaUrl } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
