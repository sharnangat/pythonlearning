const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Permission = sequelize.define(
  'Permission',
  {
    permission_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    permission_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    permission_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // No updated_at in the table schema
  }
);

module.exports = Permission;

