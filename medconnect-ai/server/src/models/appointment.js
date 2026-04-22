const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  appointmentDate: { type: DataTypes.DATEONLY, allowNull: false },
  appointmentTime: { type: DataTypes.STRING(10), allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  reason: DataTypes.TEXT,
  notes: DataTypes.TEXT
});

module.exports = Appointment;
