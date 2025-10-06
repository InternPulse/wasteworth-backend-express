'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_superuser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_staff: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      date_joined: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referral_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referred_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      address_location: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Listing, { foreignKey: 'user_id_id' });
    User.hasMany(models.Listing, { foreignKey: 'collector_id_id' });
  };

  return User;
};