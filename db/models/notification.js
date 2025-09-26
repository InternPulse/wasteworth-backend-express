'use strict';

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'userId',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: DataTypes.ENUM('pickup', 'reward', 'marketplace', 'general'),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      updatedAt: false,
    }
  );

  // Associations
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Notification;
};
