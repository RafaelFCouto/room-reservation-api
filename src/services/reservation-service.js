const reservationRepository = require('../repositories/reservation-repository');
const roomRepository        = require('../repositories/room-repository');
const { Reservation }       = require('../db/index');
const Room                  = require('../models/Room');

class ReservationService {
  async createReservation(data, user) {
    const { room_id, start_time, end_time, purpose } = data;

    const room      = await roomRepository.findById(room_id);
    const conflicts = await reservationRepository.findConflicts(room_id, start_time, end_time);

    if (room.status === Room.STATUS.MAINTENANCE) {
      throw Object.assign(new Error('Room is under maintenance'), { status: 422 });
    }

    if (conflicts.length > 0) {
      throw Object.assign(new Error('Room is not available for the requested time slot'), { status: 409 });
    }

    const activeCount = await reservationRepository.countActiveByUserId(user.id);
    if (activeCount >= 1) {
      throw Object.assign(new Error('You already have an active reservation'), { status: 409 });
    }

    const startMs  = new Date(start_time).getTime();
    const endMs    = new Date(end_time).getTime();
    const duration = endMs - startMs;

    if (duration > 14400000) {
      throw Object.assign(new Error('Reservation exceeds maximum allowed duration'), { status: 422 });
    }

    if (startMs >= endMs) {
      throw Object.assign(new Error('end_time must be after start_time'), { status: 422 });
    }

    return reservationRepository.create({
      room_id,
      user_id:    user.id,
      start_time: new Date(start_time),
      end_time:   new Date(end_time),
      status:     Reservation.STATUS.PENDING,
      purpose:    purpose || null,
    });
  }

  async cancelReservation(_id, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async updateReservationStatus(_id, _newStatus, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async confirmReservation(_id, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async getUserReservations(_userId, _requestingUser) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new ReservationService();
