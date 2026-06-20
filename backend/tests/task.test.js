const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('../models/Task');
jest.mock('jsonwebtoken');

describe('Task API', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockOtherUserId = '507f1f77bcf86cd799439022';
  const mockToken = 'mocktokenxyz';

  const mockUser = {
    _id: mockUserId,
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockTasks = [
    {
      _id: '507f1f77bcf86cd799439012',
      title: 'Apple Picking',
      description: 'We need to go apple picking in the orchard on Sunday morning.',
      status: 'Pending',
      userId: mockUserId,
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
    },
    {
      _id: '507f1f77bcf86cd799439013',
      title: 'Banana Eating Contest',
      description: 'This is a contest to see who can eat the most bananas in five minutes.',
      status: 'In Progress',
      userId: mockUserId,
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
    },
    {
      _id: '507f1f77bcf86cd799439014',
      title: 'Coconut Buying',
      description: 'Go to the local store and buy some fresh coconuts for the recipe.',
      status: 'Completed',
      userId: mockUserId,
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock behavior for auth middleware
    jwt.verify.mockReturnValue({ id: mockUserId });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task when authorized', async () => {
      const newTask = {
        title: 'Test Task One',
        description: 'This is a description that must be at least twenty characters long.',
        status: 'Pending',
      };

      Task.create.mockResolvedValue({
        ...newTask,
        userId: mockUserId,
        _id: '507f1f77bcf86cd799439015',
      });

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(newTask);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Task One');
      expect(res.body.userId).toBe(mockUserId);
    });

    it('should fail to create task if description is under 20 characters', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Test Task Title',
          description: 'Short desc',
          status: 'Pending',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toContain('at least 20 characters');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get tasks and correct stats for user', async () => {
      // Mock for main search query find()
      const mockFindChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTasks),
      };
      Task.find.mockReturnValueOnce(mockFindChain); // First call for matched paginated tasks

      // Mock countDocuments
      Task.countDocuments.mockResolvedValue(3);

      // Mock for stats aggregation (second find call for all user tasks)
      Task.find.mockReturnValueOnce(mockTasks); 

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks.length).toBe(3);
      expect(res.body.stats.total).toBe(3);
      expect(res.body.stats.pending).toBe(1);
      expect(res.body.stats.inProgress).toBe(1);
      expect(res.body.stats.completed).toBe(1);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update user own task', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439012',
        title: 'Old Title',
        description: 'This is a description that must be at least twenty characters long.',
        status: 'Pending',
        userId: mockUserId,
        save: jest.fn().mockResolvedValue({
          title: 'Updated Title',
          description: 'This is a description that must be at least twenty characters long.',
          status: 'In Progress',
        }),
      };

      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .put(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Updated Title',
          description: 'This is a description that must be at least twenty characters long.',
          status: 'In Progress',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.status).toBe('In Progress');
    });

    it('should block updates from other users', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439012',
        title: 'Task of User One',
        description: 'This is a description that must be at least twenty characters long.',
        status: 'Pending',
        userId: mockOtherUserId, // belongs to user 2
      };

      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .put(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${mockToken}`) // token belongs to user 1
        .send({
          title: 'Hack attempt',
          description: 'This is an attempt to hack another user task details.',
          status: 'Completed',
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Not authorized');
    });
  });

  describe('PUT /api/tasks/:id/complete', () => {
    it('should mark own task completed', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439012',
        title: 'Incomplete Task',
        description: 'This is a description that must be at least twenty characters long.',
        status: 'Pending',
        userId: mockUserId,
        save: jest.fn().mockImplementation(function() {
          this.status = 'Completed';
          return Promise.resolve(this);
        }),
      };

      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .put(`/api/tasks/${mockTask._id}/complete`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Completed');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete own task', async () => {
      const mockTask = {
        _id: '507f1f77bcf86cd799439012',
        title: 'Task to Delete',
        description: 'This is a description that must be at least twenty characters long.',
        status: 'Pending',
        userId: mockUserId,
      };

      Task.findById.mockResolvedValue(mockTask);
      Task.findByIdAndDelete.mockResolvedValue(mockTask);

      const res = await request(app)
        .delete(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('removed successfully');
    });
  });
});
