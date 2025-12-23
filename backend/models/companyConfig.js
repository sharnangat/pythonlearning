const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CompanyConfig = sequelize.define(
  'CompanyConfig',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Society Management Solutions',
    },
    company_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company_phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    company_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    default_rate_per_member: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 20.00,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'INR',
    },
    trial_period_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    max_free_members: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    support_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    support_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    sales_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sales_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    payment_gateway_key: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    whatsapp_api_key: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    email_api_key: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'company_config',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = CompanyConfig;

