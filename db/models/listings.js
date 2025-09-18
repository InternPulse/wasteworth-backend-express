'use strict';

module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define(
    'Listing',
    {
      listingId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      wasteType: {
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
      rewardEstimate: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      finalReward: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      collectorId_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users_user',
          key: 'userId',
        },
      },
      userId_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users_user',
          key: 'userId',
        },
      },
      pickupLocation: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: 'listings_listing',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  Listing.associate = (models) => {
    Listing.belongsTo(models.User, { foreignKey: 'userId_id', as: 'creator' }),
      Listing.belongsTo(models.User, {
        foreignKey: 'collectorId_id',
        as: 'collector',
      });
  };

  return Listing;
};
