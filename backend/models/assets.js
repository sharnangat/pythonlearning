const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Asset = sequelize.define(
  'Asset',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    society_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    asset_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    purchase_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    purchase_cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    vendor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    warranty_period: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    warranty_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    depreciation_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    current_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    last_maintenance_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    next_maintenance_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    maintenance_frequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    condition: {
      type: DataTypes.STRING(50),
      defaultValue: 'good',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'assets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Asset;

