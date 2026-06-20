const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'mock_users.json');
const TASKS_FILE = path.join(__dirname, 'mock_tasks.json');

const readData = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// User Model Mock
const MockUser = {
  findOne: async (query) => {
    const users = readData(USERS_FILE);
    const user = users.find(u => u.email.toLowerCase() === query.email.toLowerCase());
    if (user) {
      return {
        ...user,
        matchPassword: async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        }
      };
    }
    return null;
  },
  
  create: async (userData) => {
    const users = readData(USERS_FILE);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      _id: Date.now().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeData(USERS_FILE, users);
    
    return newUser;
  },
  
  findById: (id) => {
    return {
      select: async (selectStr) => {
        const users = readData(USERS_FILE);
        const user = users.find(u => u._id === id.toString());
        if (user) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        return null;
      }
    };
  }
};

// Task Model Mock
const MockTask = {
  find: (query) => {
    let tasks = readData(TASKS_FILE);
    
    // Filter by userId
    if (query.userId) {
      tasks = tasks.filter(t => t.userId === query.userId.toString());
    }
    
    // Filter by status
    if (query.status) {
      tasks = tasks.filter(t => t.status === query.status);
    }
    
    // Filter by search (title case-insensitive)
    if (query.title && query.title.$regex) {
      const regex = new RegExp(query.title.$regex, 'i');
      tasks = tasks.filter(t => regex.test(t.title));
    }
    
    // We return a query chain that has sort, skip, limit
    const chain = {
      data: tasks,
      sort: function(sortOpts) {
        const key = Object.keys(sortOpts)[0];
        const dir = sortOpts[key];
        this.data.sort((a, b) => {
          const valA = new Date(a[key]);
          const valB = new Date(b[key]);
          return dir === 1 ? valA - valB : valB - valA;
        });
        return this;
      },
      skip: function(n) {
        this.data = this.data.slice(n);
        return this;
      },
      limit: function(n) {
        this.data = this.data.slice(0, n);
        return this;
      },
      // Thenable to resolve the chain
      then: function(resolve, reject) {
        const mapped = this.data.map(t => ({
          ...t,
          save: async function() {
            const allTasks = readData(TASKS_FILE);
            const idx = allTasks.findIndex(item => item._id === this._id);
            if (idx !== -1) {
              allTasks[idx] = {
                _id: this._id,
                title: this.title,
                description: this.description,
                status: this.status,
                createdAt: this.createdAt,
                userId: this.userId
              };
              writeData(TASKS_FILE, allTasks);
            }
            return this;
          }
        }));
        resolve(mapped);
      }
    };
    
    return chain;
  },
  
  countDocuments: async (query) => {
    let tasks = readData(TASKS_FILE);
    if (query.userId) {
      tasks = tasks.filter(t => t.userId === query.userId.toString());
    }
    if (query.status) {
      tasks = tasks.filter(t => t.status === query.status);
    }
    if (query.title && query.title.$regex) {
      const regex = new RegExp(query.title.$regex, 'i');
      tasks = tasks.filter(t => regex.test(t.title));
    }
    return tasks.length;
  },
  
  create: async (taskData) => {
    const tasks = readData(TASKS_FILE);
    const newTask = {
      _id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'Pending',
      createdAt: new Date().toISOString(),
      userId: taskData.userId.toString()
    };
    tasks.push(newTask);
    writeData(TASKS_FILE, tasks);
    return newTask;
  },
  
  findById: async (id) => {
    const tasks = readData(TASKS_FILE);
    const task = tasks.find(t => t._id === id.toString());
    if (task) {
      return {
        ...task,
        save: async function() {
          const allTasks = readData(TASKS_FILE);
          const idx = allTasks.findIndex(item => item._id === this._id);
          if (idx !== -1) {
            allTasks[idx] = {
              _id: this._id,
              title: this.title,
              description: this.description,
              status: this.status,
              createdAt: this.createdAt,
              userId: this.userId
            };
            writeData(TASKS_FILE, allTasks);
          }
          return this;
        }
      };
    }
    return null;
  },
  
  findByIdAndDelete: async (id) => {
    const tasks = readData(TASKS_FILE);
    const filtered = tasks.filter(t => t._id !== id.toString());
    writeData(TASKS_FILE, filtered);
    return { _id: id };
  }
};

module.exports = {
  MockUser,
  MockTask
};
