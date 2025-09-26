import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Task from './models/Task.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'password',
      role: 'admin'
    });

    const regularUser = new User({
      name: 'John Doe',
      email: 'user@demo.com',
      password: 'password',
      role: 'user'
    });

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@demo.com',
      password: 'password',
      role: 'user'
    });

    await adminUser.save();
    await regularUser.save();
    await user2.save();

    console.log('Demo users created');

    // Create demo tasks
    const tasks = [
      {
        title: 'Setup Development Environment',
        description: 'Install Node.js, MongoDB, and configure the development environment for the project.',
        status: 'completed',
        priority: 'high',
        assignedTo: regularUser._id,
        createdBy: adminUser._id
      },
      {
        title: 'Design Database Schema',
        description: 'Create the database schema for users, tasks, and relationships between entities.',
        status: 'completed',
        priority: 'high',
        assignedTo: user2._id,
        createdBy: adminUser._id
      },
      {
        title: 'Implement Authentication System',
        description: 'Build JWT-based authentication with login, register, and token verification.',
        status: 'in-progress',
        priority: 'high',
        assignedTo: regularUser._id,
        createdBy: adminUser._id
      },
      {
        title: 'Create Task Management API',
        description: 'Develop REST API endpoints for CRUD operations on tasks with proper authorization.',
        status: 'in-progress',
        priority: 'medium',
        assignedTo: user2._id,
        createdBy: adminUser._id
      },
      {
        title: 'Build React Frontend',
        description: 'Create responsive React application with Tailwind CSS for the user interface.',
        status: 'pending',
        priority: 'high',
        assignedTo: regularUser._id,
        createdBy: adminUser._id
      },
      {
        title: 'Implement Role-Based Access Control',
        description: 'Add middleware and frontend logic to handle different user roles and permissions.',
        status: 'pending',
        priority: 'medium',
        assignedTo: user2._id,
        createdBy: adminUser._id
      },
      {
        title: 'Add Task Status Management',
        description: 'Allow users to update task status and implement drag-and-drop functionality.',
        status: 'pending',
        priority: 'medium',
        assignedTo: regularUser._id,
        createdBy: adminUser._id
      },
      {
        title: 'Write Unit Tests',
        description: 'Create comprehensive test suite for both backend API and frontend components.',
        status: 'pending',
        priority: 'low',
        assignedTo: user2._id,
        createdBy: adminUser._id
      },
      {
        title: 'Deploy to Production',
        description: 'Set up production environment and deploy the application with proper security measures.',
        status: 'pending',
        priority: 'low',
        assignedTo: adminUser._id,
        createdBy: adminUser._id
      }
    ];

    await Task.insertMany(tasks);
    console.log('Demo tasks created');

    console.log('\n=== DEMO ACCOUNTS ===');
    console.log('Admin Account:');
    console.log('  Email: admin@demo.com');
    console.log('  Password: password');
    console.log('  Role: admin');
    console.log('\nUser Accounts:');
    console.log('  Email: user@demo.com');
    console.log('  Password: password');
    console.log('  Role: user');
    console.log('\n  Email: jane@demo.com');
    console.log('  Password: password');
    console.log('  Role: user');
    console.log('\nDatabase seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
