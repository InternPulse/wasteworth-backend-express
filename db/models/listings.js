'use strict';

module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define(
    'Listing',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      waste_type: {
        type: DataTypes.ENUM('plastic', 'glass', 'paper'),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'accepted',
          'in-progress',
          'completed',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      reward_estimate: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      final_reward: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      collector_id_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      user_id_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      pickup_location: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: 'listings',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Listing.associate = (models) => {
    Listing.belongsTo(models.User, { foreignKey: 'user_id_id', as: 'creator' }),
      Listing.belongsTo(models.User, {
        foreignKey: 'collector_id_id',
        as: 'collector',
      });
  };

  return Listing;
};