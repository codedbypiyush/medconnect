'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Doctors', key: 'id' },
        onDelete: 'CASCADE'
      },
      appointmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      appointmentTime: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending'
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Appointments', ['patientId'], { name: 'appointments_patient_id_index' });
    await queryInterface.addIndex('Appointments', ['doctorId'], { name: 'appointments_doctor_id_index' });
    await queryInterface.addIndex('Appointments', ['status'], { name: 'appointments_status_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Appointments');
  }
};
