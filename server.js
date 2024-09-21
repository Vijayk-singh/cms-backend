const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');
const port = process.env.PORT || 5000;
const connectDB = require('./config/db')
const dotenv = require('dotenv');
// CORS Configuration
dotenv.config();
const corsOptions = {
  origin: 'https://jankari.netlify.app', // Frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};
connectDB()
app.use(cors(corsOptions)); // Apply CORS configuration

// Middleware to parse JSON bodies
app.use(express.json());

// Use your routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
