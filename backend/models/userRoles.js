const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserRole = sequelize.define(
  'UserRole',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    society_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assigned_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    valid_from: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'user_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // No updated_at column in schema
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'society_id', 'role_id'],
        name: 'user_roles_user_id_society_id_role_id_key',
      },
    ],
  }
);

module.exports = UserRole;

