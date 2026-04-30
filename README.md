# Course Management System

A full-stack Node.js application for managing courses with user authentication and session management.

## Features

✅ User Registration & Login with bcrypt password hashing
✅ Session-based authentication
✅ Course CRUD Operations (Create, Read, Update, Delete)
✅ User enrollment in courses
✅ MongoDB database
✅ Responsive UI with EJS templates
✅ Course name immutability (cannot be changed after creation)

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally or connection string)
- npm

## Installation

1. **Clone/Navigate to project directory**

   ```bash
   cd "e:\6th Semester\Node Js\Lab Exam"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)

   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB connection in .env**
   ```
   MONGODB_URI=mongodb://localhost:27017/course-management
   PORT=3000
   SESSION_SECRET=your_secret_key_here
   ```

## Running the Project

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The application will start at `http://localhost:3000`

## Project Structure

```
├── models/              # MongoDB schemas
│   ├── User.js
│   └── Course.js
├── routes/              # Route handlers
│   ├── auth.js         # Authentication routes
│   └── courses.js      # Course CRUD routes
├── views/              # EJS templates
│   ├── layout.ejs      # Main layout
│   ├── auth/           # Login & Register pages
│   └── courses/        # Course views
├── public/
│   ├── css/            # Stylesheets
│   └── js/             # Client-side scripts
├── app.js              # Main Express app
├── .env                # Environment variables
└── package.json        # Dependencies
```

## API Routes

### Authentication

- `GET /auth/register` - Show registration form
- `POST /auth/register` - Register new user
- `GET /auth/login` - Show login form
- `POST /auth/login` - Login user
- `GET /logout` - Logout user

### Courses

- `GET /courses` - List all courses
- `GET /courses/new` - Show create course form
- `POST /courses` - Create new course
- `GET /courses/:id` - View course details
- `GET /courses/:id/edit` - Show edit form
- `POST /courses/:id` - Update course (except courseName)
- `GET /courses/:id/delete` - Delete course

## Database Schemas

### User Schema

- gender (String, required)
- number (String, required)
- coursesEnrolled (Array of objects)
- email (String, unique, required)
- password (String, hashed)
- firstName (String, required)
- lastName (String, required)

### Course Schema

- courseName (String, required, immutable)
- price (Number, required)
- image (String, required)
- duration (Number, required)
- courseStartDate (Date, required)

## Notes

- Course names cannot be changed after creation
- All other course details can be updated
- Passwords are hashed using bcryptjs
- Session expires after 24 hours of inactivity
- Only authenticated users can access courses

## Author

Node.js Lab Exam
