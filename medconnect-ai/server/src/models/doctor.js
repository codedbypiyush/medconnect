const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  specialization: { type: DataTypes.STRING(100), allowNull: false },
  experience: DataTypes.INTEGER,
  qualification: DataTypes.STRING(255),
  bio: DataTypes.TEXT,
  consultationFee: DataTypes.DECIMAL(10, 2),
  availableFrom: DataTypes.STRING(10),
  availableTo: DataTypes.STRING(10),
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Doctor;
