const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hierarchy_level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Role;

