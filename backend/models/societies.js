const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Society = sequelize.define(
  'Society',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    society_type: {
      type: DataTypes.STRING, // Using STRING instead of UNKNOWN
      allowNull: false,
    },
    registration_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    registration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    established_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address_line1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      defaultValue: 'India',
    },
    primary_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    secondary_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pan_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    tan_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    gst_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bank_account_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank_ifsc: {
      type: DataTypes.STRING(11),
      allowNull: true,
    },
    bank_branch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    founded_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    current_chairman: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    total_units: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_area_sqft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    common_area_sqft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    maintenance_due_day: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    late_fee_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    grace_period_days: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'societies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Society;

