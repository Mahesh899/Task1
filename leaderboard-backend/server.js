const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Points History Schema
const pointsHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  pointsAwarded: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
const PointsHistory = mongoose.model('PointsHistory', pointsHistorySchema);

// Initialize default users
const initializeUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultUsers = [
        'Rahul', 'Kamal', 'Sanak', 'Priya', 'Amit', 
        'Sneha', 'Ravi', 'Pooja', 'Vikash', 'Anita'
      ];
      
      for (const name of defaultUsers) {
        await User.create({ name });
      }
      console.log('Default users initialized');
      await calculateRankings();
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
};

// Calculate and update rankings
const calculateRankings = async () => {
  try {
    const users = await User.find().sort({ totalPoints: -1, createdAt: 1 });
    
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      await users[i].save();
    }
    
    return users;
  } catch (error) {
    console.error('Error calculating rankings:', error);
    throw error;
  }
};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes

// Get all users with rankings
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1, createdAt: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'User name is required' });
    }
    
    const existingUser = await User.findOne({ name: name.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = new User({ name: name.trim() });
    await newUser.save();
    
    await calculateRankings();
    const updatedUsers = await User.find().sort({ totalPoints: -1, createdAt: 1 });
    
    // Emit real-time update
    io.emit('leaderboard-update', updatedUsers);
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim points for a user
app.post('/api/claim-points', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate random points between 1 and 10
    const randomPoints = Math.floor(Math.random() * 10) + 1;
    
    // Update user's total points
    user.totalPoints += randomPoints;
    await user.save();
    
    // Create points history record
    const historyRecord = new PointsHistory({
      userId: user._id,
      userName: user.name,
      pointsAwarded: randomPoints
    });
    await historyRecord.save();
    
    // Recalculate rankings
    await calculateRankings();
    const updatedUsers = await User.find().sort({ totalPoints: -1, createdAt: 1 });
    
    // Emit real-time update
    io.emit('leaderboard-update', updatedUsers);
    
    res.json({
      user: user,
      pointsAwarded: randomPoints,
      newTotalPoints: user.totalPoints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get points history
app.get('/api/points-history', async (req, res) => {
  try {
    const history = await PointsHistory.find()
      .populate('userId', 'name')
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get points history for a specific user
app.get('/api/points-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await PointsHistory.find({ userId })
      .sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize the application
const startServer = async () => {
  try {
    await initializeUsers();
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

startServer();
