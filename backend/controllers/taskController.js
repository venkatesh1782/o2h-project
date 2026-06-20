const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get all tasks with filtering, search, sorting, pagination, and dashboard stats
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Build Query for Filters & Search
    const query = { userId };

    // Status filter
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Title search (case-insensitive regex)
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // 2. Sorting
    let sortOptions = { createdAt: -1 }; // default: newest
    if (req.query.sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    // 3. Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // 4. Fetch Tasks & Total Count matching the query
    const totalMatchingTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // 5. Calculate Statistics for ALL user tasks (not just matching filters)
    const allUserTasks = await Task.find({ userId });
    const stats = {
      total: allUserTasks.length,
      pending: allUserTasks.filter((t) => t.status === 'Pending').length,
      inProgress: allUserTasks.filter((t) => t.status === 'In Progress').length,
      completed: allUserTasks.filter((t) => t.status === 'Completed').length,
    };

    return res.json({
      tasks,
      page,
      pages: Math.ceil(totalMatchingTasks / limit) || 1,
      totalTasks: totalMatchingTasks,
      stats,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      userId: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (process.env.USE_MOCK_DB !== 'true' && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (process.env.USE_MOCK_DB !== 'true' && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(id);
    return res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Mark a task completed
// @route   PUT /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res) => {
  const { id } = req.params;

  if (process.env.USE_MOCK_DB !== 'true' && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = 'Completed';
    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error('Error completing task:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  const { id } = req.params;

  if (process.env.USE_MOCK_DB !== 'true' && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Error fetching task details:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
};
