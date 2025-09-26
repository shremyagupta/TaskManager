import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { ArrowLeft, Edit, Trash2, Calendar, User, Clock, AlertCircle, CheckCircle, UserCheck, BarChart3 } from 'lucide-react';
import axios from 'axios';
import API from '../config/api';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { tasks, updateTaskStatus, deleteTask } = useTask();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id, tasks]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      // Check if task exists in context first
      const existingTask = tasks.find(t => t._id === id);
      if (existingTask) {
        setTask(existingTask);
        setLoading(false);
        return;
      }
      
      // If not in context, fetch from API with auth headers
      const response = await axios.get(API.TASKS.BY_ID(id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTask(response.data);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError(error.response?.data?.message || 'Failed to fetch task details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    const result = await updateTaskStatus(task._id, newStatus);
    if (result.success) {
      setTask(prev => ({ ...prev, status: newStatus }));
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }
    
    setUpdating(true);
    const result = await deleteTask(task._id);
    if (result.success) {
      navigate('/dashboard');
    }
    setUpdating(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'in-progress': return <AlertCircle className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task?.status !== 'completed';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Task</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-black hover:bg-gray-100 border border-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TM</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-black">Task Details</h1>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/tasks/${task._id}/edit`)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium text-black bg-white hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium text-black bg-white hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-gray-300 overflow-hidden">
          {/* Task Header */}
          <div className="px-6 py-4 border-b border-gray-300 bg-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-black mb-3">{task.title}</h2>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium flex items-center space-x-1 ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    <span>{task.status.replace('-', ' ').toUpperCase()}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Description */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-medium text-black mb-3 uppercase">
                  Description
                </h3>
                <div className="bg-white border border-gray-300 p-4">
                  <p className="text-gray-700 text-sm">{task.description}</p>
                </div>
              </div>

              {/* Task Details */}
              <div>
                <h3 className="text-sm font-medium text-black mb-3 uppercase">
                  Details
                </h3>
                <div className="bg-white border border-gray-300 p-4 space-y-3">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-gray-600 block">Due Date</span>
                      <span className={`font-medium text-sm ${
                        isOverdue(task.dueDate) ? 'text-red-600' : 'text-black'
                      }`}>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && ' (OVERDUE)'}
                      </span>
                    </div>
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-start">
                      <User className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-gray-600 block">Assigned To</span>
                        <span className="font-medium text-sm text-black">{task.assignedTo.name}</span>
                        <span className="text-xs text-gray-600 block">{task.assignedTo.email}</span>
                      </div>
                    </div>
                  )}
                  
                  {task.createdBy && (
                    <div className="flex items-start">
                      <UserCheck className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-gray-600 block">Created By</span>
                        <span className="font-medium text-sm text-black">{task.createdBy.name}</span>
                        <span className="text-xs text-gray-600 block">{task.createdBy.email}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-gray-600 block">Created On</span>
                      <span className="font-medium text-sm text-black">{formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Actions */}
            <div className="mt-6 pt-4 border-t border-gray-300">
              <h3 className="text-sm font-medium text-black mb-3 uppercase">
                Update Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange('pending')}
                    disabled={loading}
                    className="px-3 py-2 text-xs font-medium text-black bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    Mark as Pending
                  </button>
                )}
                {task.status !== 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    disabled={loading}
                    className="px-3 py-2 text-xs font-medium text-black bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    Start Progress
                  </button>
                )}
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    disabled={loading}
                    className="px-3 py-2 text-xs font-medium text-black bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
