const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const PROFILE = Object.freeze({
  STUDENT:     'student',
  PROFESSOR:   'professor',
  COORDINATOR: 'coordinator',
});

class User extends Model {}

User.init({
  name:    { type: DataTypes.STRING,                                         allowNull: false },
  email:   { type: DataTypes.STRING,                                         allowNull: false, unique: true },
  profile: { type: DataTypes.ENUM('student', 'professor', 'coordinator'),   allowNull: false },
}, { sequelize, modelName: 'User', tableName: 'users' });

User.PROFILE = PROFILE;

module.exports = User;
