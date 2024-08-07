const express = require('express');
const multer = require('multer');
const mediaController = require('../controllers/mediaController'); // Adjust the path as necessary

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Adjust the destination as necessary

// Routes for BlogPost media
router.post('/blogPost/:id/media', upload.single('file'), mediaController.uploadBlogPostMedia);
router.post('/blogPost/:id/multiple-media', upload.array('files', 10), mediaController.uploadMultipleBlogPostMedia); // Adjust the max count as necessary
router.get('/blogPost/:id/media', mediaController.getBlogPostMedia);
router.put('/blogPost/:id/media', upload.array('files', 10), mediaController.updateBlogPostMedia);
router.delete('/blogPost/:id/media/:mediaUrl', mediaController.deleteBlogPostMedia);

// Routes for Donation media
router.post('/donation/:id/media', upload.single('file'), mediaController.uploadDonationMedia);
router.post('/donation/:id/multiple-media', upload.array('files', 10), mediaController.uploadMultipleDonationMedia);
router.get('/donation/:id/media', mediaController.getDonationMedia);
router.put('/donation/:id/media', upload.array('files', 10), mediaController.updateDonationMedia);
router.delete('/donation/:id/media/:mediaUrl', mediaController.deleteDonationMedia);

// Routes for Message media
router.post('/message/:id/media', upload.single('file'), mediaController.uploadMessageMedia);
router.post('/message/:id/multiple-media', upload.array('files', 10), mediaController.uploadMultipleMessageMedia);
router.get('/message/:id/media', mediaController.getMessageMedia);
router.put('/message/:id/media', upload.array('files', 10), mediaController.updateMessageMedia);
router.delete('/message/:id/media/:mediaUrl', mediaController.deleteMessageMedia);

// Routes for User media
router.post('/user/:id/media', upload.single('file'), mediaController.uploadUserMedia);
router.post('/user/:id/multiple-media', upload.array('files', 10), mediaController.uploadMultipleUserMedia);
router.get('/user/:id/media', mediaController.getUserMedia);
router.put('/user/:id/media', upload.array('files', 10), mediaController.updateUserMedia);
router.delete('/user/:id/media/:mediaUrl', mediaController.deleteUserMedia);

module.exports = router;
