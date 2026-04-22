const { Op } = require('sequelize');
const { Doctor, User } = require('../models');
const catchAsync = require('../utils/catchAsync');

const userInclude = { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] };

exports.list = catchAsync(async (req, res) => {
  const where = { isApproved: true };
  if (req.query.specialization) {
    where.specialization = { [Op.iLike]: `%${req.query.specialization}%` };
  }
  const doctors = await Doctor.findAll({ where, include: [userInclude], order: [['createdAt', 'DESC']] });
  res.json(doctors);
});

exports.getById = catchAsync(async (req, res) => {
  const doctor = await Doctor.findOne({
    where: { id: req.params.id, isApproved: true },
    include: [userInclude]
  });
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
});

exports.createProfile = catchAsync(async (req, res) => {
  if (!req.body.specialization) {
    return res.status(400).json({ message: 'Specialization is required' });
  }
  if (await Doctor.findOne({ where: { userId: req.user.id } })) {
    return res.status(409).json({ message: 'Profile already exists' });
  }

  const doctor = await Doctor.create({
    ...req.body,
    userId: req.user.id,
    isApproved: false
  });

  res.status(201).json(doctor);
});
