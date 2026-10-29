const reservationRepository = require('../repositories/reservation-repository');
const roomRepository        = require('../repositories/room-repository');
const { Reservation }       = require('../db/index');
const Room                  = require('../models/Room');

const { positiveId, timeRange, invalid } = require('../utils/input');

const MAX_RESERVATION_DURATION_MS = 4 * 60 * 60 * 1000;

class ReservationService {
  // Regras aplicaveis: RN-01, RN-02, RN-03, RN-04, RN-06 (docs/regras_negocio.md).
  async createReservation(data, user) {
    const { room_id, start_time, end_time, purpose } = data;
    const roomId = positiveId(room_id);
    const { start, end } = timeRange(start_time, end_time);
    if (purpose !== undefined && purpose !== null && typeof purpose !== 'string') {
      throw invalid('purpose must be a string');
    }

    const [room, conflicts, activeCount] = await Promise.all([
      roomRepository.findById(roomId),
      reservationRepository.findConflicts(roomId, start, end),
      reservationRepository.countActiveByUserId(user.id),
    ]);
    if (!room) throw Object.assign(new Error('Room not found'), { status: 404 });
    if (room.status === Room.STATUS.MAINTENANCE) {
      throw Object.assign(new Error('Room is under maintenance'), { status: 422 });
    }
    if (conflicts.length > 0) {
      throw Object.assign(new Error('Room is not available for the requested time slot'), { status: 409 });
    }
    if (activeCount >= 1) {
      throw Object.assign(new Error('You already have an active reservation'), { status: 409 });
    }
    if (end - start > MAX_RESERVATION_DURATION_MS) {
      throw Object.assign(new Error('Reservation exceeds maximum allowed duration'), { status: 422 });
    }
    return reservationRepository.create({
      room_id: roomId, user_id: user.id, start_time: start, end_time: end,
      status: Reservation.STATUS.PENDING, purpose: purpose || null,
    });
  }

  // Regras aplicaveis: RN-05 (docs/regras_negocio.md).
  async cancelReservation(_id, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  // Regras aplicaveis: RN-05, RN-06 (docs/regras_negocio.md).
  async updateReservationStatus(_id, _newStatus, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  // Regras aplicaveis: RN-06 (docs/regras_negocio.md).
  async confirmReservation(_id, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async getUserReservations(_userId, _requestingUser) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new ReservationService();
