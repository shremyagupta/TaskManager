import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import API from '../config/api';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch tasks
  const fetchTasks = useCallback(async (params = {}) => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params);
      const response = await axios.get(API.TASKS.BASE, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to fetch tasks');
      setTasks([]); // Clear tasks on error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Create task (Admin only)
  const createTask = async (taskData) => {
    try {
      const response = await axios.post(API.TASKS.BASE, taskData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(prev => [response.data, ...prev]);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(API.TASKS.BY_ID(taskId), updates, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? response.data : task
      ));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update task status (Users can do this for their assigned tasks)
  const updateTaskStatus = async (taskId, status) => {
    return updateTask(taskId, { status });
  };

  // Delete task (Admin only)
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(API.TASKS.BY_ID(taskId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(prev => prev.filter(task => task._id !== taskId));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Fetch tasks when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, user, fetchTasks]);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    clearError: () => setError(null)
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
