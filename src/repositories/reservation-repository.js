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
        status:  { [Op.in]: ['PENDING', 'CONFIRMED'] },
      },
    });
  }

  findConflicts(roomId, startTime, endTime) {
    return Reservation.findAll({
      where: {
        room_id:    roomId,
        status:     { [Op.in]: ['PENDING', 'CONFIRMED'] },
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

  create(data) {
    return Reservation.create(data);
  }

  update(id, data) {
    return Reservation.update(data, { where: { id } });
  }
}

module.exports = new ReservationRepository();
