import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Calendar, User, Clock, AlertCircle, CheckCircle, ArrowLeft, BarChart3, UserCheck, Eye } from 'lucide-react';
import API from '../config/api';

const TaskList = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { tasks, loading, error, fetchTasks } = useTask();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 10
  });

  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority })
    };
    fetchTasks(params);
  }, [filters, pagination.currentPage]);

  // Use tasks directly from context which are already filtered and paginated by the backend
  const paginatedTasks = tasks;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <h1 className="text-xl font-semibold text-black">All Tasks</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-300 p-6 mb-6">
          <h2 className="text-sm font-medium text-black mb-4 flex items-center uppercase">
            <Filter className="w-4 h-4 mr-2 text-black" />
            Search & Filter Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-black bg-white text-black text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black bg-white text-black text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black bg-white text-black text-sm"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black bg-white text-black text-sm"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && paginatedTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No tasks found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Tasks Grid */}
        {!loading && paginatedTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {paginatedTasks.map((task) => (
              <div key={task._id} className="bg-white border border-gray-300 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-black text-sm line-clamp-2 leading-tight">{task.title}</h3>
                  <div className="flex items-center space-x-2 ml-3">
                    <span className={`px-2 py-1 text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
                
                {/* Task Metadata */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-xs">
                    <Calendar className="w-3 h-3 mr-1 text-gray-600" />
                    <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      Due: {formatDate(task.dueDate)}
                      {isOverdue(task.dueDate, task.status) && ' (OVERDUE)'}
                    </span>
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-center text-xs">
                      <User className="w-3 h-3 mr-1 text-gray-600" />
                      <span className="text-gray-600">
                        To: <span className="font-medium text-black">{task.assignedTo.name}</span>
                      </span>
                    </div>
                  )}
                  
                  {task.createdBy && (
                    <div className="flex items-center text-xs">
                      <UserCheck className="w-3 h-3 mr-1 text-gray-600" />
                      <span className="text-gray-600">
                        By: <span className="font-medium text-black">{task.createdBy.name}</span>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                  <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                  
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-black hover:bg-gray-100 border border-gray-300 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-gray-300 p-4">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>Showing</span>
              <span className="font-medium text-black">{(pagination.currentPage - 1) * pagination.limit + 1}</span>
              <span>to</span>
              <span className="font-medium text-black">
                {Math.min(pagination.currentPage * pagination.limit, pagination.total)}
              </span>
              <span>of</span>
              <span className="font-medium text-black">{pagination.total}</span>
              <span>tasks</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-black bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-2 py-1 text-xs font-medium transition-colors ${
                        pagination.currentPage === pageNumber
                          ? 'bg-black text-white'
                          : 'text-black bg-white border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-black bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
