const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/db');

const Member = sequelize.define(
  'Member',
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    member_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(50),
      defaultValue: 'Indian',
    },
    primary_phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    secondary_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergency_contact_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    permanent_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    current_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aadhar_number: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    pan_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    passport_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    organization: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    membership_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    leaving_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    has_voting_rights: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    profile_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['society_id', 'email'],
        name: 'members_society_id_email_key',
      },
    ],
  }
);

module.exports = Member;

