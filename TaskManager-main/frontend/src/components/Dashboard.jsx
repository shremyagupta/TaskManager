import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import { Plus, LogOut, Users, BarChart3, List, Calendar, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { tasks, loading, error } = useTask();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tasksByStatus = {
    pending: tasks.filter(task => task.status === 'pending'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed')
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'border-gray-300 bg-gray-50';
      case 'in-progress': return 'border-blue-300 bg-blue-50';
      case 'completed': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TM</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-black">Task Manager</h1>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <span className={`px-3 py-1 border text-xs font-medium ${
                  isAdmin ? 'bg-white text-black border-black' : 'bg-white text-black border-gray-400'
                }`}>
                  {isAdmin ? 'Administrator' : 'Team Member'}
                </span>
                <button
                  onClick={() => navigate('/tasks')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-black hover:bg-gray-100 border border-gray-300 transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span>All Tasks</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-black">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              
              {isAdmin && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </button>
              )}

              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-black hover:bg-gray-100 border border-gray-300 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-300 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-black uppercase">Pending Tasks</p>
                <p className="text-3xl font-bold text-black">{tasksByStatus.pending.length}</p>
                <p className="text-xs text-gray-600 mt-1">Awaiting action</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-black uppercase">In Progress</p>
                <p className="text-3xl font-bold text-black">{tasksByStatus['in-progress'].length}</p>
                <p className="text-xs text-gray-600 mt-1">Active work</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-black uppercase">Completed</p>
                <p className="text-3xl font-bold text-black">{tasksByStatus.completed.length}</p>
                <p className="text-xs text-gray-600 mt-1">Finished tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Task Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-white border border-gray-300">
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-gray-300 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-sm font-medium text-black uppercase">
                      {getStatusTitle(status)}
                    </h2>
                  </div>
                  <span className="bg-white px-2 py-1 text-xs font-medium text-black border border-gray-300">
                    {statusTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks Container */}
              <div className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {statusTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-sm">No tasks</p>
                    </div>
                  ) : (
                    statusTasks.map((task, index) => (
                      <div key={task._id || `task-${status}-${index}`}>
                        <TaskCard task={task} />
                      </div>
                    ))
                  )}
                </div>
                
                {/* Add Task Button for Admins */}
                {isAdmin && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full mt-4 py-2 text-sm font-medium text-black hover:bg-gray-100 border border-gray-300 border-dashed transition-colors"
                  >
                    + Add Task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-500 mb-6">
              {isAdmin 
                ? "Get started by creating your first task." 
                : "No tasks have been assigned to you yet."
              }
            </p>
            {isAdmin && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
