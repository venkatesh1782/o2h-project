const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    trim: true,
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Pending', 'In Progress', 'Completed'],
      message: 'Status must be Pending, In Progress, or Completed',
    },
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
});

const MongooseTask = mongoose.model('Task', taskSchema);

const delegate = (methodName) => {
  return function(...args) {
    const activeModel = process.env.USE_MOCK_DB === 'true'
      ? require('./mockModels').MockTask
      : MongooseTask;
    return activeModel[methodName](...args);
  };
};

module.exports = {
  find: delegate('find'),
  countDocuments: delegate('countDocuments'),
  create: delegate('create'),
  findById: delegate('findById'),
  findByIdAndDelete: delegate('findByIdAndDelete'),
};
