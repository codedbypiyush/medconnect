const { Appointment, Doctor, User } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.book = catchAsync(async (req, res) => {
  const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
  if (!doctorId || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: 'doctorId, appointmentDate and appointmentTime are required' });
  }

  const doctor = await Doctor.findOne({ where: { id: doctorId, isApproved: true } });
  if (!doctor) return res.status(404).json({ message: 'Doctor not found or not approved' });

  const appointment = await Appointment.create({
    patientId: req.user.id,
    doctorId,
    appointmentDate,
    appointmentTime,
    reason,
    status: 'pending'
  });

  res.status(201).json(appointment);
});

exports.mine = catchAsync(async (req, res) => {
  const appointments = await Appointment.findAll({
    where: { patientId: req.user.id },
    include: [{
      model: Doctor,
      as: 'doctor',
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone'] }]
    }],
    order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']]
  });
  res.json(appointments);
});

exports.schedule = catchAsync(async (req, res) => {
  const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
  if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

  const appointments = await Appointment.findAll({
    where: { doctorId: doctor.id },
    include: [{ model: User, as: 'patient', attributes: ['name', 'email', 'phone'] }],
    order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
  });
  res.json(appointments);
});

exports.updateStatus = catchAsync(async (req, res) => {
  const { status, notes } = req.body;
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
  if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

  const appointment = await Appointment.findOne({
    where: { id: req.params.id, doctorId: doctor.id }
  });
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  await appointment.update({ status, ...(notes !== undefined && { notes }) });
  res.json(appointment);
});

exports.cancel = catchAsync(async (req, res) => {
  const appointment = await Appointment.findOne({
    where: { id: req.params.id, patientId: req.user.id }
  });
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  if (['cancelled', 'completed'].includes(appointment.status)) {
    return res.status(400).json({ message: 'Cannot cancel this appointment' });
  }

  await appointment.update({ status: 'cancelled' });
  res.json(appointment);
});
