const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');

// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

// READ - Show all courses
router.get('/', checkAuth, async (req, res) => {
  try {
    const courses = await Course.find();
    const user = await User.findById(req.session.userId);
    res.render('courses/index', { courses, user });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching courses');
  }
});

// CREATE - Show form for new course
router.get('/new', checkAuth, (req, res) => {
  res.render('courses/new');
});

// CREATE - Add new course
router.post('/', checkAuth, async (req, res) => {
  try {
    const { courseName, price, image, duration, courseStartDate } = req.body;

    const course = new Course({
      courseName,
      price,
      image,
      duration,
      courseStartDate
    });

    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
    res.status(400).render('courses/new', { error: 'Error creating course' });
  }
});

// SHOW - View single course details
router.get('/:id', checkAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.render('courses/show', { course });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching course');
  }
});

// EDIT - Show edit form
router.get('/:id/edit', checkAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.render('courses/edit', { course });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching course');
  }
});

// EDIT - Update course (only courseName cannot be changed)
router.post('/:id', checkAuth, async (req, res) => {
  try {
    const { price, image, duration, courseStartDate } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    // Only courseName cannot be changed
    course.price = price;
    course.image = image;
    course.duration = duration;
    course.courseStartDate = courseStartDate;

    await course.save();
    res.redirect(`/courses/${course._id}`);
  } catch (err) {
    console.log(err);
    res.status(400).render('courses/edit', { course, error: 'Error updating course' });
  }
});

// DELETE - Remove course
router.get('/:id/delete', checkAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting course');
  }
});

module.exports = router;
