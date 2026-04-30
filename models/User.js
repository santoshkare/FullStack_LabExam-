const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  number: {
    type: String,
    required: true
  },
  coursesEnrolled: {
    type: [
      {
        courseName: {
          type: String,
          enum: ['WEB'],
          required: true
        }
      }
    ],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
