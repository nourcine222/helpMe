// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  };
  