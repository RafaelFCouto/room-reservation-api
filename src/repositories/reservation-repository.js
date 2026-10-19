const { Op }         = require('sequelize');
const { Reservation } = require('../db/index');

class ReservationRepository {
  findById(id) {
    return Reservation.findByPk(id);
  }

  findAll(options = {}) {
    return Reservation.findAll(options);
  }

  findActiveByRoomId(roomId) {
    return Reservation.findAll({
      where: {
        room_id: roomId,
        status:  { [Op.in]: [Reservation.STATUS.PENDING, Reservation.STATUS.CONFIRMED] },
      },
    });
  }

  findConflicts(roomId, startTime, endTime) {
    return Reservation.findAll({
      where: {
        room_id:    roomId,
        status:     { [Op.in]: [Reservation.STATUS.PENDING, Reservation.STATUS.CONFIRMED] },
        start_time: { [Op.lt]:  new Date(endTime)   },
        end_time:   { [Op.gte]: new Date(startTime) },
      },
    });
  }

  countActiveByUserId(userId) {
    return Reservation.count({
      where: { user_id: userId },
    });
  }

  findByUserId(userId) {
    return Reservation.findAll({ where: { user_id: userId } });
  }

  findOccupiedRoomIds(startTime, endTime) {
    const where = {
      status: { [Op.in]: [Reservation.STATUS.PENDING, Reservation.STATUS.CONFIRMED] },
    };
    if (startTime !== undefined && endTime !== undefined) {
      where.start_time = { [Op.lt]: new Date(endTime) };
      where.end_time = { [Op.gt]: new Date(startTime) };
    }
    return Reservation.findAll({
      attributes: ['room_id'], where, group: ['room_id'], raw: true,
    }).then(rows => rows.map(row => row.room_id));
  }

  create(data) {
    return Reservation.create(data);
  }

  update(id, data) {
    return Reservation.update(data, { where: { id } });
  }
}

module.exports = new ReservationRepository();
