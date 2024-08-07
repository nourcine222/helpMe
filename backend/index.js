const User =require ('./models/User');
const BlogPost =require ('./models/BlogPost');
const Donation =require ('./models/Donation');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const passport = require('passport');
const passportConfig = require('./config/passport');
const { connectDB } = require('./config');

// Import routes
const userRoutes = require('./routes/userRoutes');
const donationRoutes = require('./routes/donationRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/auth'); // Import the auth routes
const { errorHandler } = require('./middleware/errorHandler');
const mediaRouter =require('./routes/mediaRoutes')
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Configure session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport); // Pass passport directly to the function

// Cloudinary configuration
const cloudinary = require('./config/cloudinary'); // Adjust the path as necessary
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Set up multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'media', // The folder in Cloudinary where you want to store the files
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'mkv'], // Allowable formats
  },
});

const upload = multer({ storage: storage });

// Cloudinary file upload routes
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  cloudinary.uploader.upload(
    req.file.path,
    { resource_type: "auto" },
    (error, result) => {
      if (error) {
        console.error("Upload error:", error);
        return res.status(500).send({ message: "Upload failed", error });
      }
      res.status(200).send(result);
    }
  );
});

app.post("/api/uploadLogo", upload.single("logo"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  cloudinary.uploader.upload(
    req.file.path,
    { resource_type: "auto" },
    (error, result) => {
      if (error) {
        console.error("Upload error:", error);
        return res.status(500).send({ message: "Upload failed", error });
      }
      res.status(200).send(result);
    }
  );
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // Add authentication routes
app.use('/api/donations', donationRoutes);
app.use('/api/blog-posts', blogPostRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/media', mediaRouter);
// Add media routes

// Dashboard stats route
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Fetch counts for each type of data
    const userCount = await User.countDocuments();
    const donationCount = await Donation.countDocuments();
    const blogPostCount = await BlogPost.countDocuments();
    
    // Count users with the role 'donor'
    const donorCount = await User.countDocuments({ role: 'donor' });

    // Send response as an array with the counts
    res.status(200).json([userCount, donationCount, blogPostCount, donorCount]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error });
  }
});


// Use error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
