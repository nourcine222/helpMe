const Donation = require('../models/Donation'); // Import the Donation model

// Create a new donation
exports.createDonation = async (req, res) => {
    try {
        const donationData = req.body;
        const newDonation = new Donation(donationData);
        await newDonation.save();
        res.status(201).json({ message: 'Donation created successfully', donation: newDonation });
    } catch (error) {
        res.status(500).json({ message: 'Error creating donation', error });
    }
};
exports.getDonationsByStatus = async (req, res) => {
    const { status } = req.params;
    try {
      const donations = await Donation.find({ status });
      res.status(200).json(donations);
    } catch (error) {
      console.error('Error fetching donations by status:', error); // Log the error
      res.status(500).json({ message: 'Error fetching donations by status', error });
    }
  };
  
// Get all donations
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find();
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations', error });
    }
};

// Get a donation by ID
exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.status(200).json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation', error });
    }
};

// Update a donation
exports.updateDonation = async (req, res) => {
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.status(200).json({ message: 'Donation updated successfully', donation: updatedDonation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating donation', error });
    }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting donation', error });
    }
};
// donationController.js

exports.getDonationsWithPendingReports = async (req, res) => {
    try {
        const donations = await Donation.find({ "reports.status": "pending" })
        .populate({
            path: 'userId', // Populate the user field
            select: 'name email' // Select specific fields from the user
        })
        .populate({
            path: 'reports.reporterId', // Optionally populate the userId in reports if needed
            select: 'name email' // Select specific fields from the user
        })
        .sort({ "reports.createdAt": -1 }) // Sort by the most recent report
        .exec();
        
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving donations with pending reports', error });
    }
};

exports.createReport = async (req, res) => {
    const { donationId } = req.params;
    const { userId, reason } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.reports.push({ userId, reason });
        await donation.save();

        res.status(201).json({ message: 'Report created successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error creating report', error });
    }
};
exports.requestDonation = async (req, res) => {
    try {
        const {donationId} = req.params; 
        const requesterId = req.body.userId; 

        console.log("Looking up donation with ID:", donationId); // Add this line

        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        const existingRequest = donation.requests.find(
            (request) => request.requesterId.toString() === requesterId.toString()
        );

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already requested this donation' });
        }

        donation.requests.push({ requesterId, status: 'pending' });
        await donation.save();

        res.status(200).json({ message: 'Request submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteReport = async (req, res) => {
    const { donationId, reportId } = req.params;

    try {
        const donation = await Donation.findOneAndUpdate(
            { _id: donationId },
            { $pull: { reports: { _id: reportId } } },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation or report not found' });
        }

        res.status(200).json({ message: 'Report deleted successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting report', error });
    }
};

exports.resolveReport = async (req, res) => {
    const { donationId, reportId } = req.params;

    try {
        const donation = await Donation.findOneAndUpdate(
            { _id: donationId, "reports._id": reportId },
            { $set: { "reports.$.status": "resolved" } },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation or report not found' });
        }
        
        res.status(200).json({ message: 'Report status changed to resolved', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating report status', error });
    }
};

exports.reviewReport = async (req, res) => {
    const { donationId, reportId } = req.params;

    try {
        const donation = await Donation.findOneAndUpdate(
            { _id: donationId, "reports._id": reportId },
            { $set: { "reports.$.status": "reviewed" } },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation or report not found' });
        }

        res.status(200).json({ message: 'Report status changed to reviewed', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating report status', error });
    }
};
exports.deleteComment = async (req, res) => {
    const { donationId, id } = req.params;

    try {
        // Use the $pull operator to remove the comment directly
        const donation = await Donation.updateOne(
            { _id: donationId },
            { $pull: { comments: { _id: id } } }
        );

        // Check if the comment was successfully deleted
        if (donation.nModified === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ message: 'Comment deletion issue:', error });
    }
};


// Add a comment to a donation
exports.addComment = async (req, res) => {
    const { donationId } = req.params;
    const { userId, content } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.comments.push({ userId, content });
        await donation.save();

        res.status(201).json({ message: 'Comment added successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

// Like a donation
exports.likeDonation = async (req, res) => {
    const { donationId } = req.params;
    const { userId } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.likes.some(like => like.userId === userId)) {
            return res.status(400).json({ message: 'User has already liked this donation' });
        }

        donation.likes.push({ userId });
        await donation.save();

        res.status(200).json({ message: 'Donation liked successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error liking donation', error });
    }
};
// Unlike a donation
exports.unlikeDonation = async (req, res) => {
    const { donationId } = req.params;
    const { userId } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Filter out the like
        donation.likes = donation.likes.filter(like => 
            like.userId && like.userId.equals(userId) // Ensure userId exists
        );

        await donation.save();

        res.status(200).json({ message: 'Donation unliked successfully', likes: donation.likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error unliking donation', error: error.message });
    }
};


// Save a donation
exports.saveDonation = async (req, res) => {
    const { donationId } = req.params;
    const { userId } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.saves.some(save => save.userId.toString() === userId)) {
            return res.status(400).json({ message: 'User has already saved this donation' });
        }

        donation.saves.push({ userId });
        await donation.save();

        res.status(200).json({ message: 'Donation saved successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error saving donation', error });
    }
};
// Unsaved a donation
exports.unsaveDonation = async (req, res) => {
    const { donationId } = req.params;
    const { userId } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Remove the save
        donation.saves = donation.saves.filter(save => 
            save.userId && save.userId.equals(userId) // Ensure userId exists
        );

        await donation.save();

        res.status(200).json({ message: 'Donation unsaved successfully', saves: donation.saves });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error unsaving donation', error: error.message });
    }
};



// Select a recipient for a donation
exports.selectRecipient = async (req, res) => {
    const { donationId } = req.params;
    const { userId } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.selectedRecipient = userId;
        await donation.save();

        res.status(200).json({ message: 'Recipient selected successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error selecting recipient', error });
    }
};
const fixcategory = (type) => {
    switch (type) {
        // Pastel Red
        case 'HouseholdItems':
            return 'Household Items'; // Pastel Purple
        case 'SportsEquipment':
            return 'Sports Equipment'; // Pastel Light Green
        ;// Pastel White
        default:
            return type; // Default color (e.g., white) if type is not found
    }
};
// Get donations by category
exports.getDonationsByCategory = async (req, res) => {
    const { category } = fixcategory(req.params);

    try {
        const donations = await Donation.find({ category });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations by category', error });
    }
};
exports.getDonationsByDonor = async (req, res) => {
    const { donorID } = req.params;

    try {
        // Fetch donations where userId matches the donorID
        const donations = await Donation.find({ userId: donorID });

        // Check if donations were found
        if (donations.length === 0) {
            return res.status(404).json({ message: 'No donations found for this donor' });
        }

        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations by donor', error });
    }
};


// Update request status
exports.updateRequestStatus = async (req, res) => {
    const { donationId, requestId } = req.params;
    const { status } = req.body;

    try {
        const donation = await Donation.findOneAndUpdate(
            { _id: donationId, 'requests._id': requestId },
            { $set: { 'requests.$.status': status } },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation or request not found' });
        }

        // If the request status is accepted, update the donation status to completed
        if (status === 'accepted') {
            donation.status = 'completed';
            await donation.save();
        }

        res.status(200).json({ message: 'Request status updated successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating request status', error });
    }
};

// Get all requests for a donation
exports.getRequestsForDonation = async (req, res) => {
    const { donationId } = req.params;

    try {
        const donation = await Donation.findById(donationId)
        .populate({
            path: 'requests.requesterId', // Optionally populate the userId in reports if needed
            ref :'User',
            select :'name anonymity location' // Select specific fields from the user
        })
        .sort({ "requests.createdAt": -1 }) // Sort by the most recent report
        .exec();;
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        res.status(200).json(donation.requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
};
//media :
const cloudinary =require('../config/cloudinary')
// Upload media to Cloudinary
exports.uploadMedia = async (req, res) => {
    try {
        const mediaUrls = [];

        // Loop through the uploaded files and upload each one to Cloudinary
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            mediaUrls.push(result.secure_url);
        }

        // Find the donation by ID and update the media field
        const donation = await Donation.findById(req.params.donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.media.push(...mediaUrls); // Add the new media URLs to the donation
        await donation.save();

        res.status(200).json({ message: 'Media uploaded successfully', media: donation.media });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading media', error });
    }
};

// Get media associated with a donation
exports.getMediaForDonation = async (req, res) => {
    const { donationId } = req.params;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.status(200).json(donation.media); // Return the media URLs
    } catch (error) {
        res.status(500).json({ message: 'Error fetching media', error });
    }
};

// Delete media from a donation
exports.deleteMedia = async (req, res) => {
    const { donationId, mediaId } = req.params; // Assume mediaId is the index of the media item in the array

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Check if mediaId is a valid index
        if (mediaId < 0 || mediaId >= donation.media.length) {
            return res.status(400).json({ message: 'Invalid media ID' });
        }

        // Optionally, you might want to delete from Cloudinary before removing from the donation
        const mediaUrl = donation.media[mediaId];
        // Extract the public ID from the media URL if needed
        const publicId = mediaUrl.split('/').pop().split('.')[0]; // Adjust as per your Cloudinary URL structure

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Remove the media URL from the donation
        donation.media.splice(mediaId, 1);
        await donation.save();

        res.status(200).json({ message: 'Media deleted successfully', media: donation.media });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting media', error });
    }
};
