const router = require('express').Router();
const { Doctor, User } = require('../models');
const catchAsync = require('../utils/catchAsync');

router.post('/approve/:id', catchAsync(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  await doctor.update({ isApproved: true });
  res.json(doctor);
}));

router.get('/doctors', catchAsync(async (req, res) => {
  const doctors = await Doctor.findAll({
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }],
    order: [['isApproved', 'ASC'], ['createdAt', 'DESC']]
  });
  res.json(doctors);
}));

module.exports = router;
