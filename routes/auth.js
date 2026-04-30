const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register GET
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Register POST
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, number, courseName } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !gender || !number) {
      return res.status(400).render('auth/register', { error: 'All fields are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).render('auth/register', { error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      number,
      coursesEnrolled: [{ courseName: courseName || 'WEB' }]
    });

    await user.save();

    // Set session
    req.session.userId = user._id;
    req.session.userName = `${user.firstName} ${user.lastName}`;
    
    console.log(`✓ User registered successfully: ${email}`);
    
    // Save session and redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).render('auth/register', { error: 'Session error' });
      }
      res.redirect('/courses');
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).render('auth/register', { error: 'Error during registration. Please try again.' });
  }
});

// Login GET
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('auth/login', { error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login attempt with non-existent email: ${email}`);
      return res.status(400).render('auth/login', { error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login attempt with wrong password for: ${email}`);
      return res.status(400).render('auth/login', { error: 'Invalid email or password' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.userName = `${user.firstName} ${user.lastName}`;
    
    console.log(`✓ User logged in successfully: ${email}`);
    
    // Save session and redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).render('auth/login', { error: 'Session error' });
      }
      res.redirect('/courses');
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).render('auth/login', { error: 'Error during login. Please try again.' });
  }
});

module.exports = router;
