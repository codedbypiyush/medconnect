const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !['patient', 'doctor'].includes(role)) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (await User.findOne({ where: { email } })) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    phone
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: signToken(user.id, user.role)
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: signToken(user.id, user.role)
  });
});
