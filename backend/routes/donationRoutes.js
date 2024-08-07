const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController'); // Ensure this path is correct
const Donation = require('../models/Donation'); // Import the Donation model

const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define where to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
    },
});

const upload = multer({ storage });

// Log functions to check if they are defined
console.log('Donation Controller:', donationController);

// Define your routes
router.post('/', donationController.createDonation);
router.get('/', donationController.getAllDonations);
router.get('/:id', donationController.getDonationById);
router.put('/:id', donationController.updateDonation); // Ensure this function is defined
router.delete('/:id', donationController.deleteDonation);
router.get('/status/:status', donationController.getDonationsByStatus);
router.get('/donor/:donorID', donationController.getDonationsByDonor);

// Report-related routes
router.get('/reports/pending', donationController.getDonationsWithPendingReports);
router.post('/:donationId/reports', donationController.createReport);
router.delete('/:donationId/reports/:reportId', donationController.deleteReport);
router.put('/:donationId/reports/:reportId/resolve', donationController.resolveReport);
router.put('/:donationId/reports/:reportId/review', donationController.reviewReport);
router.post('/:donationId/request', donationController.requestDonation);

// Comment-related routes
router.post('/:donationId/comments', donationController.addComment);
router.delete('/:donationId/comments/:id', donationController.deleteComment);

// Like-related routes
router.post('/:donationId/likes', donationController.likeDonation);
router.post('/:donationId/unLikes', donationController.unlikeDonation);
// Save-related routes
router.post('/:donationId/saves', donationController.saveDonation);
router.post('/:donationId/unSaves', donationController.unsaveDonation);
// Recipient selection route
router.put('/:donationId/recipient', donationController.selectRecipient);

// Get donations by category
router.get('/category/:category', donationController.getDonationsByCategory);

// Update request status
router.put('/:donationId/requests/:requestId/status', donationController.updateRequestStatus);

// Get all requests for a donation
router.get('/:donationId/requests', donationController.getRequestsForDonation);
router.post('/:donationId/approve', async (req, res) => {
    const { donationId } = req.params;
    const { requestId } = req.body;
  
    try {
      await Donation.updateOne(
        { _id: donationId, 'requests._id': requestId },
        { $set: { 'requests.$.status': 'approved' } }
      );
  
      await Donation.updateOne(
        { _id: donationId, 'requests._id': { $ne: requestId } },
        { $set: { 'requests.$.status': 'rejected' } },
        { multi: true }
      );
  
      await Donation.updateOne({ _id: donationId }, { status: 'completed' });
  
      res.status(200).json({ message: 'Request approved and donation completed' });
    } catch (error) {
      console.error('Error approving request:', error);
      res.status(500).json({ message: 'Failed to approve request', error });
    }
  });
  
// Media routes
router.post('/:donationId/media', upload.array('media', 10), donationController.uploadMedia);
router.get('/:donationId/media', donationController.getMediaForDonation);
router.delete('/:donationId/media/:mediaId', donationController.deleteMedia);

module.exports = router;
