const sequelize   = require('./connection');
const User        = require('../models/User');
const Room        = require('../models/Room');
const Reservation = require('../models/Reservation');

Reservation.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Room.hasMany(Reservation,   { foreignKey: 'room_id', as: 'reservations' });
User.hasMany(Reservation,   { foreignKey: 'user_id', as: 'reservations' });

module.exports = { sequelize, User, Room, Reservation };
