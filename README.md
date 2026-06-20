# Project Management Portal

A modern, responsive, full-stack Project Management Portal built using React (Vite), Express.js, and MongoDB. The application features a professional blue and white theme, dark mode, task CRUD operations with filtering, sorting, pagination, and real-time title searches, all protected behind secure JWT authentication.

---

## Features

- **JWT Authentication**: Register and login securely; JWT stored in local storage and appended to Axios headers.
- **Protected Dashboard Routes**: Restricts workspace and task management screens to authenticated sessions.
- **Interactive Stats Cards**: Displays Total, Pending, In Progress, and Completed tasks.
- **Dynamic Task Management**:
  - Add, edit, delete, and mark tasks completed.
  - Delete safety prompt (confirmation dialog).
  - Search by task title.
  - Filter tasks by status.
  - Sort tasks by creation date (newest or oldest).
  - Clean client pagination (5 tasks per page).
- **Responsive Layout**: Modern navigation bar, collapsible sidebar, and responsive grid layouts (fluid table on desktop, cards on mobile).
- **Dark Mode Switch**: Sleek and persistent dark mode utilizing custom CSS variables.
- **Form Validations**: Complete checks on backend (express-validator) and frontend (character lengths and required inputs).
- **Unit Testing**: Jest unit tests for backend, and Vitest/React Testing Library tests for frontend.

---

## Tech Stack

### Frontend:
- **Core**: React.js (Vite)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Styling**: Bootstrap 5, Custom Vanilla CSS
- **Icons**: React Icons (Fa)

### Backend:
- **Framework**: Node.js, Express.js
- **Database ORM**: Mongoose (MongoDB Atlas)
- **Security**: JWT (jsonwebtoken), bcryptjs
- **Validators**: express-validator
- **Cross-Origin Requests**: CORS
- **Testing**: Jest, Supertest

---

## Folder Structure

```
project-root
├── backend
│   ├── config
│   │   └── db.js               # Database connection
│   ├── controllers
│   │   ├── authController.js   # Login and Register logic
│   │   └── taskController.js   # Task CRUD, filters, stats, pagination
│   ├── middleware
│   │   ├── authMiddleware.js   # JWT authentication validation
│   │   ├── errorMiddleware.js  # Global express error handler
│   │   └── validationMiddleware.js # Input validation rules
│   ├── models
│   │   ├── User.js             # Mongoose User model & password hooks
│   │   └── Task.js             # Mongoose Task model & schemas
│   ├── routes
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── taskRoutes.js       # Task endpoints
│   ├── utils
│   │   └── generateToken.js    # JWT generation utility
│   ├── tests
│   │   ├── auth.test.js        # Auth integration tests
│   │   └── task.test.js        # Task integration tests
│   ├── server.js               # Express application entrypoint
│   └── package.json
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   │   ├── EmptyState.jsx      # Empty state layout
│   │   │   ├── FilterDropdown.jsx  # Status filter
│   │   │   ├── Footer.jsx          # Common footer
│   │   │   ├── LoadingSpinner.jsx  # Async spin wheel
│   │   │   ├── Navbar.jsx          # Header with user, date, dark toggle
│   │   │   ├── Pagination.jsx      # Next/Prev buttons
│   │   │   ├── ProtectedRoute.jsx  # Route guard wrapper
│   │   │   ├── SearchBar.jsx       # Input search bar
│   │   │   ├── Sidebar.jsx         # Collapsible drawer
│   │   │   ├── StatsCards.jsx      # Metrics counters
│   │   │   ├── TaskCard.jsx        # Mobile list item
│   │   │   ├── TaskForm.jsx        # Create/Edit task form
│   │   │   └── TaskTable.jsx       # Desktop list table
│   │   ├── context
│   │   │   ├── AuthContext.jsx     # User authentication state
│   │   │   ├── ThemeContext.jsx    # Dark/Light mode state
│   │   │   └── ToastContext.jsx    # Overlay alerts provider
│   │   ├── layouts
│   │   │   └── DashboardLayout.jsx # Master page template
│   │   ├── pages
│   │   │   ├── Dashboard.jsx       # Workspace view
│   │   │   ├── Login.jsx           # Sign in view
│   │   │   ├── NotFound.jsx        # Fallback 404 view
│   │   │   ├── Register.jsx        # Signup view
│   │   │   └── TaskFormPage.jsx    # Task add/edit view
│   │   ├── services
│   │   │   ├── api.js              # Axios base setup & interceptors
│   │   │   ├── authService.js      # Auth API calls
│   │   │   └── taskService.js      # Task API calls
│   │   ├── test
│   │   │   ├── setup.js            # Vitest environment setup
│   │   │   └── Components.test.jsx # Components test suite
│   │   ├── utils
│   │   │   └── formatDate.js       # Date parser utility
│   │   ├── App.jsx                 # Routing configuration
│   │   ├── main.jsx                # Client entrypoint
│   │   └── index.css               # Global colors & variables
│   └── package.json
└── package.json                    # Workspace runner
```

---

## Installation & Setup

### Prerequisites
- Node.js installed locally.
- MongoDB server running locally or a MongoDB Atlas connection string.

### 1. Repository Setup & Dependencies
Install both backend and frontend dependencies in one go:
```bash
npm run install-all
```

---

## Environment Variables

### Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/project_portal
JWT_SECRET=supersecretkey12345_antigravity_project_portal
NODE_ENV=development
```

### Frontend Configuration
Vite uses relative paths proxying `/api` to `http://localhost:5000` locally. If deploying, configure target URLs in Vite or environment setups.

---

## API Documentation

### Authentication Endpoints

#### Register
* **Endpoint**: `/api/auth/register`
* **Method**: `POST`
* **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Success Response**: Status `201 Created`
  ```json
  {
    "_id": "603f...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "eyJhbGci..."
  }
  ```
* **Failure Codes**: `400 Bad Request` (Validation error or user already exists), `500 Server Error`

#### Login
* **Endpoint**: `/api/auth/login`
* **Method**: `POST`
* **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Success Response**: Status `200 OK`
  ```json
  {
    "_id": "603f...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "eyJhbGci..."
  }
  ```
* **Failure Codes**: `401 Unauthorized` (Invalid email/password), `400 Bad Request` (Validation errors), `500 Server Error`

---

### Task Management Endpoints (Requires `Authorization: Bearer <JWT_TOKEN>`)

#### Get Tasks (with Search, Filter, Sort, Pagination)
* **Endpoint**: `/api/tasks`
* **Method**: `GET`
* **Query Parameters**:
  - `page`: Page number (default: `1`)
  - `limit`: Number of tasks (default: `5`)
  - `status`: `'All' | 'Pending' | 'In Progress' | 'Completed'`
  - `search`: Search string matched against title
  - `sort`: `'newest' | 'oldest'`
* **Success Response**: Status `200 OK`
  ```json
  {
    "tasks": [
      {
        "_id": "603f...",
        "title": "Build UI Components",
        "description": "Create reusable React components...",
        "status": "In Progress",
        "createdAt": "2026-06-20T10:00:00.000Z",
        "userId": "603f..."
      }
    ],
    "page": 1,
    "pages": 1,
    "totalTasks": 1,
    "stats": {
      "total": 1,
      "pending": 0,
      "inProgress": 1,
      "completed": 0
    }
  }
  ```
* **Failure Codes**: `401 Unauthorized` (Missing/expired token)

#### Create Task
* **Endpoint**: `/api/tasks`
* **Method**: `POST`
* **Body**:
  ```json
  {
    "title": "Complete Portal Walkthrough",
    "description": "Prepare walkthrough documents and test files for portal.",
    "status": "Pending"
  }
  ```
* **Success Response**: Status `201 Created`
  ```json
  {
    "_id": "6040...",
    "title": "Complete Portal Walkthrough",
    "description": "Prepare walkthrough documents and test files for portal.",
    "status": "Pending",
    "createdAt": "2026-06-20T12:00:00.000Z",
    "userId": "603f..."
  }
  ```
* **Failure Codes**: `400 Bad Request` (Title missing, description length < 20 characters), `401 Unauthorized`

#### Update Task
* **Endpoint**: `/api/tasks/:id`
* **Method**: `PUT`
* **Body**:
  ```json
  {
    "title": "Complete Portal Walkthrough [Updated]",
    "description": "Prepare walkthrough documents and test files for portal. (Updated long version)",
    "status": "In Progress"
  }
  ```
* **Success Response**: Status `200 OK` (Returns updated task body)
* **Failure Codes**: `400 Bad Request` (Invalid task ID), `403 Forbidden` (Not authorized to update this task), `404 Not Found`, `401 Unauthorized`

#### Complete Task
* **Endpoint**: `/api/tasks/:id/complete`
* **Method**: `PUT`
* **Body**: None
* **Success Response**: Status `200 OK`
  ```json
  {
    "_id": "6040...",
    "title": "Complete Portal Walkthrough",
    "status": "Completed"
  }
  ```
* **Failure Codes**: `400 Bad Request`, `403 Forbidden`, `404 Not Found`, `401 Unauthorized`

#### Delete Task
* **Endpoint**: `/api/tasks/:id`
* **Method**: `DELETE`
* **Success Response**: Status `200 OK`
  ```json
  {
    "message": "Task removed successfully"
  }
  ```
* **Failure Codes**: `400 Bad Request`, `403 Forbidden`, `404 Not Found`, `401 Unauthorized`

---

## How to Run

### Run Local Development Servers
To start the backend (Express) and frontend (Vite) concurrently using the workspace scripts:
```bash
# Start backend
npm run dev-backend

# In a separate terminal, start frontend
npm run dev-frontend
```

Now, navigate to:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Run Unit Tests
```bash
# Run backend tests (Jest)
npm run test-backend

# Run frontend tests (Vitest)
npm run test-frontend
```

---

## Screenshots Placeholder
Here is a visual overview placeholder of the portal layouts:
- [Dashboard Staging View](screenshots/dashboard_view.png)
- [Responsive Layout Controls](screenshots/responsive_views.png)

---

## Deployment Steps

### Backend (Render.com)
1. Log into Render, select **New Web Service**.
2. Connect your Git repository.
3. Configure settings:
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) under **Environment**.
5. Save and deploy.

### Frontend (Vercel)
1. Install Vercel CLI or connect GitHub to Vercel.
2. Configure build configurations:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add Rewrite rules in `vercel.json` if proxying calls or redirecting fallback routes:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://your-backend-render-url.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
4. Click deploy.

---

## Git Commit History Reference

```bash
# Initial Project Setup
git commit -m "Initial Project Setup"

# Backend Setup
git commit -m "Backend Setup"

# MongoDB Connected
git commit -m "MongoDB Connected"

# Authentication Completed
git commit -m "Authentication Completed"

# Task CRUD Completed
git commit -m "Task CRUD Completed"

# Dashboard UI Completed
git commit -m "Dashboard UI Completed"

# Filtering Added
git commit -m "Filtering Added"

# Search Added
git commit -m "Search Added"

# Pagination Added
git commit -m "Pagination Added"

# Dark Mode Added
git commit -m "Dark Mode Added"

# README Updated
git commit -m "README Updated"

# Deployment Ready
git commit -m "Deployment Ready"
```
