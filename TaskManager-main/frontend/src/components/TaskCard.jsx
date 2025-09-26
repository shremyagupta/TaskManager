import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { Edit, Trash2, Clock, AlertCircle, CheckCircle, Calendar, Eye, User, UserCheck } from 'lucide-react';

const TaskCard = ({ task }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { updateTaskStatus, deleteTask } = useTask();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-progress': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (loading) return;
    
    setLoading(true);
    await updateTaskStatus(task._id, newStatus);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (loading) return;
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    
    setLoading(true);
    await deleteTask(task._id);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task?.status !== 'completed';
  };

  return (
    <div className="bg-white border border-gray-300 p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
      {/* Priority Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </span>
        {isAdmin && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tasks/${task._id}/edit`);
              }}
              className="p-1 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
              title="Edit task"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={loading}
              className="p-1 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Delete task"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Task Title */}
      <h3 className="font-medium text-black text-sm mb-2 line-clamp-2 leading-tight">{task.title}</h3>

      {/* Task Description */}
      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>

      {/* Due Date */}
      <div className="flex items-center text-xs text-gray-600 mb-3">
        <Calendar className="w-3 h-3 mr-1" />
        <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : 'text-gray-600'}>
          Due: {formatDate(task.dueDate)}
          {isOverdue(task.dueDate, task.status) && ' (OVERDUE)'}
        </span>
      </div>

      {/* Assigned By */}
      {task.createdBy && (
        <div className="flex items-center text-xs text-gray-600 mb-3">
          <UserCheck className="w-3 h-3 mr-1" />
          <span>By: <span className="font-medium text-black">{task.createdBy.name}</span></span>
        </div>
      )}

      {/* View Button */}
      <div 
        onClick={() => {
          if (task._id) {
            navigate(`/tasks/${task._id}`);
          }
        }}
        className="w-full text-center py-2 text-xs font-medium text-black hover:bg-gray-100 border-t border-gray-300 cursor-pointer"
      >
        View Details
      </div>
    </div>
  );
};

export default TaskCard;
