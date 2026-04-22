'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      specialization: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      qualification: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      consultationFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      availableFrom: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      availableTo: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    await queryInterface.addIndex('Doctors', ['userId'], { name: 'doctors_user_id_index' });
    await queryInterface.addIndex('Doctors', ['specialization'], { name: 'doctors_specialization_index' });
    await queryInterface.addIndex('Doctors', ['isApproved'], { name: 'doctors_is_approved_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Doctors');
  }
};
