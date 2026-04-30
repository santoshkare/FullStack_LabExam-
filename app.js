require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/course-management';
console.log('Connecting to MongoDB at:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✓ MongoDB connected successfully'))
.catch(err => {
  console.error('✗ MongoDB connection error:', err.message);
  console.error('Make sure MongoDB is running on localhost:27017');
});

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Middleware to check if user is logged in
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.userId ? true : false;
  res.locals.userName = req.session.userName || null;
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));

// Home Route
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/courses');
  } else {
    res.redirect('/auth/login');
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
