const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // defaultValue helps existing rows migrate when column is added.
    username: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'temp_username' },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    first_name: { type: DataTypes.STRING(100) },
    last_name: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(15) },
    status: { type: DataTypes.STRING, defaultValue: 'pending_verification' },
    email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    failed_login_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    account_locked_until: { type: DataTypes.DATE },
    password_reset_token: { type: DataTypes.STRING(255) },
    password_reset_expires: { type: DataTypes.DATE },
    email_verification_token: { type: DataTypes.STRING(255) },
    email_verification_expires: { type: DataTypes.DATE },
    last_login: { type: DataTypes.DATE },
    last_login_ip: { type: DataTypes.STRING(45) }, // IPv4 & IPv6 safe
    created_by: { type: DataTypes.UUID },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = User;
