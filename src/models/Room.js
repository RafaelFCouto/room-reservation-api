const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const STATUS = Object.freeze({
  AVAILABLE:   'AVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
});

class Room extends Model {}

Room.init({
  name:      { type: DataTypes.STRING,                          allowNull: false },
  capacity:  { type: DataTypes.INTEGER,                         allowNull: false },
  building:  { type: DataTypes.STRING,                          allowNull: false },
  resources: { type: DataTypes.JSON,                            defaultValue: [] },
  status:    { type: DataTypes.ENUM('AVAILABLE', 'MAINTENANCE'), defaultValue: STATUS.AVAILABLE },
}, { sequelize, modelName: 'Room', tableName: 'rooms' });

Room.STATUS = STATUS;

module.exports = Room;
