const cloudinary =require('./cloudinary')
const passport =require('./passport')
const connectDB =require('./database')

module.exports = {
  cloudinary,
  connectDB,
  passport,
};
