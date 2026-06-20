import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import taskService from '../services/taskService';

// Components
import StatsCards from '../components/StatsCards';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import TaskTable from '../components/TaskTable';
import TaskCard from '../components/TaskCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const { showToast } = useToast();

  // State Variables
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters, search and sorting states
  const [searchVal, setSearchVal] = useState('');
  const [statusVal, setStatusVal] = useState('All');
  const [sortVal, setSortVal] = useState('newest');

  // Debounced/delayed search state to avoid redundant calls
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Update debounced search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
      setCurrentPage(1); // Reset page on search change
    }, 400);

    return () => clearTimeout(handler);
  }, [searchVal]);

  // Fetch Tasks from API
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({
        page: currentPage,
        limit: 5,
        status: statusVal,
        search: debouncedSearch,
        sort: sortVal,
      });
      setTasks(data.tasks);
      setTotalPages(data.pages);
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Failed to load tasks. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusVal, debouncedSearch, sortVal, showToast]);

  // Fetch tasks on query parameter updates
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Mark task completed handler
  const handleCompleteTask = async (id) => {
    try {
      await taskService.completeTask(id);
      showToast('Task marked as Completed!', 'success');
      fetchTasks();
    } catch (err) {
      console.error('Error completing task:', err);
      showToast('Failed to complete task.', 'danger');
    }
  };

  // Delete task handler
  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      showToast('Task deleted successfully!', 'success');
      
      // If we deleted the last item on the current page, go to previous page
      if (tasks.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Failed to delete task.', 'danger');
    }
  };

  const handleStatusChange = (status) => {
    setStatusVal(status);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSortChange = (e) => {
    setSortVal(e.target.value);
    setCurrentPage(1); // Reset page on sort change
  };

  return (
    <div>
      {/* Page Title & Add Button */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Dashboard</h2>
          <p className="text-secondary small mb-0">Track and manage task accomplishments</p>
        </div>
        <Link 
          to="/tasks/new" 
          className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
        >
          <FaPlus />
          <span>Add New Task</span>
        </Link>
      </div>

      {/* Stats Cards Panel */}
      <StatsCards stats={stats} />

      {/* Query Filters Box */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          {/* Real-time Search */}
          <div className="col-12 col-md-5">
            <SearchBar searchVal={searchVal} onSearchChange={setSearchVal} />
          </div>

          {/* Status Filter */}
          <div className="col-12 col-sm-6 col-md-3">
            <FilterDropdown statusVal={statusVal} onStatusChange={handleStatusChange} />
          </div>

          {/* Date Sorting */}
          <div className="col-12 col-sm-6 col-md-4 d-flex align-items-center gap-2">
            <label htmlFor="sorting-select" className="text-secondary small fw-medium text-nowrap mb-0">
              Sort By:
            </label>
            <select
              id="sorting-select"
              className="form-select form-select-sm"
              value={sortVal}
              onChange={handleSortChange}
            >
              <option value="newest">Newest Created</option>
              <option value="oldest">Oldest Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table & Responsive Grid list */}
      {loading ? (
        <LoadingSpinner size="lg" text="Retrieving workspace tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState 
          title={debouncedSearch || statusVal !== 'All' ? 'No matching tasks' : 'No tasks created'}
          message={
            debouncedSearch || statusVal !== 'All' 
              ? 'Try modifying your search query or status filter.' 
              : 'Add your first task and start managing your workflow.'
          }
          showAddButton={!(debouncedSearch || statusVal !== 'All')}
        />
      ) : (
        <div className="custom-card p-3">
          {/* Desktop Table View */}
          <div className="d-none d-lg-block">
            <TaskTable 
              tasks={tasks} 
              onComplete={handleCompleteTask} 
              onDelete={handleDeleteTask} 
            />
          </div>

          {/* Mobile Grid/Card View */}
          <div className="d-lg-none">
            {tasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onComplete={handleCompleteTask} 
                onDelete={handleDeleteTask} 
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
