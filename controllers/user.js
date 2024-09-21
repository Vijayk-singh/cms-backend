const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// Controller function to get all users
exports.getUser = async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Fetch all users from the database
      const users = await User.find().select('-password'); // Exclude password field
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
// Manage user role (Admin only)
exports.manageUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = req.body.role || user.role;
    await user.save();

    res.json({ msg: 'User role updated' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// Fetch the logged-in user's role based on the token
exports.getUserRole = async (req, res) => {
    try {
      // Extract token from the Authorization header
      const token = req.header('Authorization').replace('Bearer ', '');
      
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user by ID from the decoded token
      const user = await User.findById(decoded.id);
      
      if (!user) return res.status(404).json({ msg: 'User not found' });
      
      // Respond with user role
      res.json({ role: user.role });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
//
// Example endpoint in Express
exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id); // Assuming `req.user.id` is set by your auth middleware
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      res.json(user); // Send the complete user object
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
  