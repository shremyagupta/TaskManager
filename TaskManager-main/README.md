# MERN Task Manager with Role-Based Authentication

A full-stack task management application built with React, Node.js, Express, and MongoDB featuring JWT authentication and role-based access control.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User & Admin)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### User Roles & Permissions

#### User Role
- View assigned tasks
- Update task status (pending → in-progress → completed)
- Cannot create, edit, or delete tasks

#### Admin Role
- Full CRUD operations on tasks
- Create new tasks and assign to users
- Edit task details (title, description, priority, assignee)
- Delete tasks
- View all tasks in the system
- Manage user roles

### Task Management
- Three-column Kanban board layout (Pending, In Progress, Completed)
- Task priorities (Low, Medium, High)
- Task assignment to users
- Real-time status updates
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
mern-task/
├── react-task-manager/          # Frontend React app
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/           # React contexts (Auth, Task)
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                      # Backend API
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── server.js              # Entry point
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone and Setup

```bash
cd /home/imtiyaz/Desktop/mern-task
```

### 2. Backend Setup

```bash
cd server

# Install dependencies (already done)
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB URI and JWT secret
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/taskmanager
# JWT_SECRET=your_super_secret_jwt_key_here
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../react-task-manager

# Install dependencies (already done)
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
sudo systemctl start mongod

# Or if using MongoDB Atlas, update MONGODB_URI in .env
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd react-task-manager
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Demo Accounts

For testing purposes, you can create accounts with these roles:

### Admin Account
- Email: admin@demo.com
- Password: password
- Role: admin

### User Account
- Email: user@demo.com
- Password: password
- Role: user

*Note: You'll need to register these accounts through the registration form first.*

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify JWT token

### Tasks
- `GET /api/tasks` - Get tasks (filtered by role)
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)

## Usage

1. **Registration/Login**: Start by creating an account or logging in
2. **Dashboard**: View your tasks organized in a Kanban board layout
3. **Task Management**:
   - **Users**: Click status buttons to move tasks between columns
   - **Admins**: Use "New Task" button to create tasks, edit/delete existing ones
4. **Role Management**: Admins can manage user roles through the users API

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based route protection
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Development

### Adding New Features
1. Backend: Add routes in `/server/routes/`
2. Frontend: Add components in `/react-task-manager/src/components/`
3. Update contexts for state management

### Database Models
- **User**: name, email, password, role
- **Task**: title, description, status, priority, assignedTo, createdBy

## Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and URI is correct
2. **Port Conflicts**: Change ports in .env (backend) or vite.config.js (frontend)
3. **CORS Errors**: Verify frontend URL in server CORS configuration
4. **JWT Errors**: Check JWT_SECRET in .env file

### Logs
- Backend logs: Check terminal running the server
- Frontend logs: Check browser developer console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.
