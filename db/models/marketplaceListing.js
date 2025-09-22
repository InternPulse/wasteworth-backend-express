'use strict';

module.exports = (sequelize, DataTypes) => {
  const MarketplaceListing = sequelize.define(
    'MarketplaceListing',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      escrow_status: {
        type: DataTypes.ENUM('pending', 'locked', 'released', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      listing_id_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'listings',
          key: 'id',
        },
      },
      recycler_id_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'marketplace_listings',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  MarketplaceListing.associate = (models) => {
    MarketplaceListing.belongsTo(models.Listing, {
      foreignKey: 'listing_id_id',
      as: 'listing',
    });
  };

  return MarketplaceListing;
};
