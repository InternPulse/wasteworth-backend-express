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
        type: DataTypes.ENUM(
          'pending',
          'payment_initiated',
          'locked',
          'item_released',
          'confirmed',
          'released',
          'refund',
          'failed',
          'cancelled',
          'disputed'
        ),
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
      payment_initiated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      payment_locked_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      item_released_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      confirmed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      released_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      disposer_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      recycler_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
