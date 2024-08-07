const BlogPost = require('../models/BlogPost'); // Import the BlogPost model

exports.createReport = async (req, res) => {
    const { postId } = req.params;
    const reportData = req.body;

    try {
        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        blogPost.reports.push(reportData);
        await blogPost.save();

        res.status(201).json({ message: 'Report created successfully', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating report', error });
    }
};

// Function to get posts with status 'published' that need approval
const getPostsForApproval = async (req, res) => {
    try {
      // Fetch posts with status 'published'
      const posts = await BlogPost.find({ status: 'published' });
  
      // Check if posts were found
      if (!posts.length) {
        return res.status(404).json({ message: 'No posts found for approval.' });
      }
  
      // Send the posts as a response
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts for approval:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.deleteReport = async (req, res) => {
    const { postId, reportId } = req.params;

    try {
        const blogPost = await BlogPost.findOneAndUpdate(
            { _id: postId },
            { $pull: { reports: { _id: reportId } } },
            { new: true }
        );

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post or report not found' });
        }

        res.status(200).json({ message: 'Report deleted successfully', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting report', error });
    }
};

// Create a new blog post
exports.createBlogPost = async (req, res) => {
    try {
        const blogPostData = req.body;
        console.log(blogPostData);
        const newBlogPost = new BlogPost(blogPostData);
        await newBlogPost.save();
        res.status(201).json({ message: 'Blog post created successfully', blogPost: newBlogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog post', error });
    }
};

exports.getBlogPostsWithPendingReports = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find({ "reports.status": "pending" })
            .sort({ "reports.createdAt": -1 }) // Sort by the most recent report
            .exec();
        
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blog posts with pending reports', error });
    }
};

exports.resolveReport = async (req, res) => {
    const { postId, reportId } = req.params;
    
    try {
        const blogPost = await BlogPost.findOneAndUpdate(
            { _id: postId, "reports._id": reportId },
            { $set: { "reports.$.status": "resolved" } },
            { new: true }
        );

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post or report not found' });
        }

        res.status(200).json({ message: 'Report status changed to resolved', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating report status', error });
    }
};

exports.reviewReport = async (req, res) => {
    const { postId, reportId } = req.params;
    
    try {
        const blogPost = await BlogPost.findOneAndUpdate(
            { _id: postId, "reports._id": reportId },
            { $set: { "reports.$.status": "reviewed" } },
            { new: true }
        );

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post or report not found' });
        }

        res.status(200).json({ message: 'Report status changed to reviewed', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating report status', error });
    }
};

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find()
        .populate({
            path: 'author', // Optionally populate the userId in reports if needed
            ref :'User',
            select :'-password' // Select specific fields from the user
        }).populate({
            path: 'comments.userId', // Optionally populate the userId in reports if needed
            ref :'User',
            select :'name profilePhoto ' // Select specific fields from the user
        })
        .sort({ "createdAt": -1 }) 
        .exec();
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts', error });
    }
};

// Adjust the path to your BlogPost model

exports.getBlogPostById = async (req, res) => {
    try {
        console.log(req.params.id);

        // Find the blog post by ID and populate comments with user details
        const blogPost = await BlogPost.findById(req.params.id)
            .populate({
                path: 'comments.userId',
                ref :'User', // Populate user details for each comment
                select: 'name photoProfile', // Adjust fields as needed
            }).populate({
                path: 'author',
                ref :'User', // Populate user details for each comment
                select: 'name photoProfile', // Adjust fields as needed
            })
            .sort({ 'comments.createdAt': -1 }); // Sort comments by creation date in descending order

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
            
        }

        res.status(200).json(blogPost);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post', error });
    }
};


// Update a blog post
exports.updateBlogPost = async (req, res) => {
    try {
        const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post updated successfully', blogPost: updatedBlogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog post', error });
    }
};

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
    try {
        const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog post', error });
    }
};

// Like a blog post
exports.likeBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req.body; // Destructure userId from the request body

        if (!userId) {
            return res.status(400).json({ message: 'Valid User ID is required' });
        }
        console.log(postId , userId)
        // Find the blog post by ID
        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the user has already liked the post
        const likeIndex = blogPost.likes.findIndex(like => like.userId===userId);

        if (likeIndex !== -1) {
            // If already liked, remove the like
            blogPost.likes.splice(likeIndex, 1);
        } else {
            // If not liked, add the like
            blogPost.likes.push({ userId });
        }

        // Save the updated blog post
        await blogPost.save();
        res.status(200).json({ message: 'Like status updated', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error liking blog post', error });
    }
};

// Unlike a blog post
// Unlike a blog post
exports.unlikeBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId; // Assuming userId is sent in the request body

        console.log('Received request to unlike blog post');
        console.log(`Post ID: ${postId}`);
        console.log(`User ID: ${userId}`);

        // Fetch the blog post by ID
        const blogPost = await BlogPost.findById(postId);
        
        if (!blogPost) {
            console.log('Blog post not found');
            return res.status(404).json({ message: 'Blog post not found' });
        }

       
        const originalLikes = blogPost.likes.length;
        blogPost.likes = blogPost.likes.filter(like => {
            console.log(`Checking like with userId: ${like.userId}`);
            return like.userId === userId;
        });

        console.log(`Number of likes removed: ${originalLikes - blogPost.likes.length}`);

        // Save the updated blog post
        await blogPost.save();

        // Send response
        res.status(200).json({ message: 'Unlike status updated', blogPost });
    } catch (error) {
        console.error('Error unliking blog post:', error);
        res.status(500).json({ message: 'Error unliking blog post', error });
    }
};

// Unsave a blog post
exports.unsaveBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId; // Assuming userId is sent in the request body

        console.log('Received request to unsave blog post');
        console.log(`Post ID: ${postId}`);
        console.log(`User ID: ${userId}`);

        // Fetch the blog post by ID
        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            console.log('Blog post not found');
            return res.status(404).json({ message: 'Blog post not found' });
        }

        
        const originalSaves = blogPost.saves.length;
        blogPost.saves = blogPost.saves.filter(save => {
            console.log(`Checking save with userId: ${save.userId}`);
            return save.userId === userId;
        });

       
        console.log(`Number of saves removed: ${originalSaves - blogPost.saves.length}`);

        // Save the updated blog post
        await blogPost.save();
        
        // Send response
        res.status(200).json({ message: 'Unsave status updated', blogPost });
    } catch (error) {
        console.error('Error unsaving blog post:', error);
        res.status(500).json({ message: 'Error unsaving blog post', error });
    }
};


// Save a blog post
exports.saveBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId; // Assuming userId is sent in the request body

        console.log('Received request to save blog post');
        console.log(`Post ID: ${postId}`);
        console.log(`User ID: ${userId}`);

        // Fetch the blog post by ID
        const blogPost = await BlogPost.findById(postId);
        console.log('Fetched blog post:', blogPost);

        if (!blogPost) {
            console.log('Blog post not found');
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the user has already saved the post
        const alreadySaved = blogPost.saves.some(save => save.userId === userId);
        console.log(`Already saved: ${alreadySaved}`);

        if (alreadySaved) {
            // If already saved, remove the save
            console.log('User has already saved this post. Removing save.');
            blogPost.saves = blogPost.saves.filter(save => save.userId !== userId);
        } else {
            // If not saved, add the save
            console.log('User has not saved this post. Adding save.');
            blogPost.saves.push({ userId });
        }

        // Save the updated blog post
        await blogPost.save();
        console.log('Updated blog post:', blogPost);

        // Send response
        res.status(200).json({ message: 'Save status updated', blogPost });
    } catch (error) {
        console.error('Error saving blog post:', error);
        res.status(500).json({ message: 'Error saving blog post', error });
    }
};

// Report a blog post
exports.reportBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId; // Assuming userId is sent in the request body
        const reason = req.body.reason; // Assuming reason is sent in the request body

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Add the report with default status 'pending'
        blogPost.reports.push({ userId, reason, status: 'pending' });

        await blogPost.save();
        res.status(200).json({ message: 'Report status updated', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error reporting blog post', error });
    }
};

// Get blog posts by status
exports.getBlogPostsByStatus = async (req, res) => {
    try {
        const status = req.params.status; // Assuming status is passed as a URL parameter
        const blogPosts = await BlogPost.find({ status });
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts by status', error });
    }
};

// Get blog posts by status
exports.getAuthorPosts = async (req, res) => {
    try {
        console.log(req.params.id)
        const author = req.params.id; // Assuming status is passed as a URL parameter
        const blogPosts = await BlogPost.find({ author });
        res.status(200).json(blogPosts);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching blog posts by author id', error });
    }
};

// Update blog post status
exports.updateBlogPostStatus = async (req, res) => {
    try {
        const postId = req.params.id;
        const status = req.body.status; // Assuming status is sent in the request body

        const updatedBlogPost = await BlogPost.findByIdAndUpdate(postId, { status }, { new: true });
        if (!updatedBlogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post status updated successfully', blogPost: updatedBlogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog post status', error });
    }
};

// Get blog posts by category
exports.getBlogPostsByCategory = async (req, res) => {
    try {
        const category = req.params.category; // Assuming category is passed as a URL parameter
        const blogPosts = await BlogPost.find({ category });
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts by category', error });
    }
};

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId, content } = req.body; // Destructure userId and content from the request body

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Add the comment
        blogPost.comments.push({ userId, content });

        await blogPost.save();
        res.status(201).json({ message: 'Comment added successfully', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentId = req.params.commentId;
        const { content } = req.body; // Destructure content from the request body

        const blogPost = await BlogPost.findOne({ _id: postId, 'comments._id': commentId });
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post or comment not found' });
        }

        // Find the comment and update it
        const comment = blogPost.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.content = content;
        await blogPost.save();
        res.status(200).json({ message: 'Comment updated successfully', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
};



// Get all comments for a blog post
exports.getComments = async (req, res) => {
    try {
        const postId = req.params.id;

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.status(200).json(blogPost.comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

// Get a comment by ID
exports.getCommentById = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentId = req.params.commentId;

        const blogPost = await BlogPost.findOne({ _id: postId, 'comments._id': commentId });
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post or comment not found' });
        }

        const comment = blogPost.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comment', error });
    }
};
// Add a comment to a blog post
exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId, content } = req.body;

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        blogPost.comments.push({ userId, content });
        await blogPost.save();
        res.status(201).json({ message: 'Comment added successfully', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

// Update a specific comment
exports.updateComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { content } = req.body;

        const blogPost = await BlogPost.findOne({ _id: postId, 'comments._id': commentId });
        if (!blogPost) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const comment = blogPost.comments.id(commentId);
        comment.content = content;
        await blogPost.save();
        res.status(200).json({ message: 'Comment updated successfully', blogPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
};

// Delete a specific comment
exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        console.log(`Deleting comment ${commentId} from post ${postId}`);

        // Find the blog post by ID and pull the comment from the comments array
        const blogPost = await BlogPost.findByIdAndUpdate(
            postId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        if (!blogPost) {
            console.log('Blog post not found');
            return res.status(404).json({ message: 'Blog post not found' });
        }

        console.log('Comment deleted successfully');
        res.status(200).json({ message: 'Comment deleted successfully', blogPost });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

;

// Get comments for a blog post
exports.getComments = async (req, res) => {
    try {
        const postId = req.params.id;

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.status(200).json(blogPost.comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};
