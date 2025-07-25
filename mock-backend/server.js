const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'mock-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let users = [
  {
    id: 1,
    email: 'admin@sportboard.com',
    firstname: 'Admin',
    lastname: 'User',
    password: bcrypt.hashSync('admin123', 10),
    role: ['ADMIN'],
    verified: true,
    is_admin: true,
    image: null,
    phone_number: '+1234567890'
  },
  {
    id: 2,
    email: 'user@sportboard.com',
    firstname: 'Regular',
    lastname: 'User',
    password: bcrypt.hashSync('user123', 10),
    role: ['ESPECTATOR'],
    verified: true,
    is_admin: false,
    image: null,
    phone_number: '+0987654321'
  }
];

let nextUserId = 3;

// Helper functions
const generateTokens = (user) => {
  const payload = {
    user_id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    roles: user.role,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  
  const access = jwt.sign(payload, JWT_SECRET);
  const refresh = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '14d' });
  
  return { access, refresh };
};

const findUserByEmail = (email) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

// Routes

// Health check
app.get('/api/v1/health/', (req, res) => {
  res.json({ status: 'ok', message: 'Mock backend is running' });
});

// Login
app.post('/api/v1/auth/login/', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      detail: 'Email and password are required'
    });
  }
  
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      detail: 'Invalid credentials'
    });
  }
  
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      detail: 'Invalid credentials'
    });
  }
  
  const tokens = generateTokens(user);
  
  res.json({
    id: user.id.toString(),
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
    verified: user.verified,
    is_admin: user.is_admin,
    image: user.image,
    ...tokens
  });
});

// Register
app.post('/api/v1/auth/register/', (req, res) => {
  const { email, password, firstname, lastname, phone_number } = req.body;
  
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }
  
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      message: 'User with this email already exists'
    });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: nextUserId++,
    email: email.toLowerCase(),
    firstname,
    lastname,
    password: hashedPassword,
    role: ['ESPECTATOR'],
    verified: true,
    is_admin: false,
    image: null,
    phone_number: phone_number || null
  };
  
  users.push(newUser);
  
  const { password: _, ...userResponse } = newUser;
  res.status(201).json(userResponse);
});

// Token refresh
app.post('/api/v1/auth/token/refresh/', (req, res) => {
  const { refresh } = req.body;
  
  if (!refresh) {
    return res.status(400).json({
      detail: 'Refresh token is required'
    });
  }
  
  try {
    const decoded = jwt.verify(refresh, JWT_SECRET);
    const user = findUserById(decoded.user_id);
    
    if (!user) {
      return res.status(401).json({
        detail: 'User not found'
      });
    }
    
    const tokens = generateTokens(user);
    res.json({ access: tokens.access });
  } catch (error) {
    return res.status(401).json({
      detail: 'Invalid refresh token'
    });
  }
});

// Token verify
app.post('/api/v1/auth/token/verify/', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      detail: 'Token is required'
    });
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    return res.status(401).json({
      detail: 'Invalid token'
    });
  }
});

// Get user profile
app.get('/api/v1/user/:id/', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      detail: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        detail: 'User not found'
      });
    }
    
    const { password, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    return res.status(401).json({
      detail: 'Invalid token'
    });
  }
});

// Update user profile
app.patch('/api/v1/user/:id/', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      detail: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
      return res.status(404).json({
        detail: 'User not found'
      });
    }
    
    // Check if user can update this profile (own profile or admin)
    if (decoded.user_id !== parseInt(req.params.id) && !decoded.roles.includes('ADMIN')) {
      return res.status(403).json({
        detail: 'Permission denied'
      });
    }
    
    const allowedFields = ['firstname', 'lastname', 'phone_number', 'image'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    users[userIndex] = { ...users[userIndex], ...updateData };
    
    const { password, ...userResponse } = users[userIndex];
    res.json(userResponse);
  } catch (error) {
    return res.status(401).json({
      detail: 'Invalid token'
    });
  }
});

// Password reset request
app.post('/api/v1/auth/initiate-password-reset/', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      message: 'Email is required'
    });
  }
  
  const user = findUserByEmail(email);
  if (user) {
    // In a real app, this would send an email
    console.log(`Password reset requested for: ${email}`);
  }
  
  // Always return success for security
  res.json({
    message: 'If the email exists, a password reset link has been sent'
  });
});

// Create new password from token
app.post('/api/v1/auth/create-password/', (req, res) => {
  const { token, new_password } = req.body;
  
  if (!token || !new_password) {
    return res.status(400).json({
      message: 'Token and new password are required'
    });
  }
  
  // Mock implementation - in reality would validate token from email
  res.json({
    message: 'Password reset successfully'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock backend running on port ${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
  console.log('Test credentials:');
  console.log('Admin: admin@sportboard.com / admin123');
  console.log('User: user@sportboard.com / user123');
});
