const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const STATUS = Object.freeze({
  PENDING:   'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
});

class Reservation extends Model {}

Reservation.init({
  room_id:    { type: DataTypes.INTEGER, allowNull: false },
  user_id:    { type: DataTypes.INTEGER, allowNull: false },
  start_time: { type: DataTypes.DATE,    allowNull: false },
  end_time:   { type: DataTypes.DATE,    allowNull: false },
  status:     { type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'), defaultValue: STATUS.PENDING },
  purpose:    { type: DataTypes.STRING,  allowNull: true },
}, { sequelize, modelName: 'Reservation', tableName: 'reservations' });

Reservation.STATUS = STATUS;

module.exports = Reservation;
