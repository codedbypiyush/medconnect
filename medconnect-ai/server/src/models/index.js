const sequelize = require('../config/database');
const User = require('./user');
const Doctor = require('./doctor');
const Appointment = require('./appointment');

User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });

Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = { sequelize, User, Doctor, Appointment };
