const passport = require('passport');

// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error', err });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user; // Attach the user to the request
    next();
  })(req, res, next);
};
