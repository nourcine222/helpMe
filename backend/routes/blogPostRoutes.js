const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController'); // Ensure this path is correct

// Check that the functions are correctly defined in blogPostController
console.log('Blog Post Controller:', blogPostController);

// Define your routes
router.post('/', blogPostController.createBlogPost); // Create a new blog post
router.get('/', blogPostController.getAllBlogPosts); // Get all blog posts
router.get('/:id', blogPostController.getBlogPostById); // Get a blog post by ID
router.get('/author/:id', blogPostController.getAuthorPosts);

router.put('/:id', blogPostController.updateBlogPost); // Update a blog post
router.delete('/:id', blogPostController.deleteBlogPost); // Delete a blog post
router.post('/:id/like', blogPostController.likeBlogPost); // Like a blog post
router.post('/:id/unlike', blogPostController.unlikeBlogPost); // Unlike a blog post
router.post('/:id/save', blogPostController.saveBlogPost); // Save a blog post
router.post('/:id/unsave', blogPostController.unsaveBlogPost); // Unsave a blog post
router.post('/:id/report', blogPostController.reportBlogPost); // Report a blog post
router.get('/status/:status', blogPostController.getBlogPostsByStatus); // Get blog posts by status
router.put('/:id/status', blogPostController.updateBlogPostStatus); // Update blog post status
router.get('/category/:category', blogPostController.getBlogPostsByCategory); // Get blog posts by category

// Comment routes
router.post('/:id/comments', blogPostController.addComment); // Add a comment to a blog post
router.put('/:postId/comments/:commentId', blogPostController.updateComment); // Update a specific comment
router.delete('/:postId/comments/:commentId', blogPostController.deleteComment); // Delete a specific comment
router.get('/:id/comments', blogPostController.getComments); // Get comments for a blog post

// Report-related routes
router.get('/reports/pending', blogPostController.getBlogPostsWithPendingReports); // Get blog posts with pending reports
router.post('/:postId/reports', blogPostController.createReport); // Create a report
router.delete('/:postId/reports/:reportId', blogPostController.deleteReport); // Delete a report
router.put('/:postId/reports/:reportId/resolve', blogPostController.resolveReport); // Resolve a report
router.put('/:postId/reports/:reportId/review', blogPostController.reviewReport); // Review a report

module.exports = router;
