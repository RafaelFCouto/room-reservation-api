const reservationRepository = require('../repositories/reservation-repository');
const { Reservation }       = require('../db/index');

class ReservationService {
  async createReservation(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async cancelReservation(_id, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async updateReservationStatus(id, newStatus, user) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw Object.assign(new Error('Reservation not found'), { status: 404 });
    }

    const current = reservation.status;

    if (current === 'PENDING' && newStatus === 'CONFIRMED') {
      await reservationRepository.update(id, { status: 'CONFIRMED' });
      return reservationRepository.findById(id);
    }

    if (current === 'PENDING' && newStatus === 'CANCELLED') {
      await reservationRepository.update(id, { status: 'CANCELLED' });
      return reservationRepository.findById(id);
    }

    if (current === 'CONFIRMED' && newStatus === 'CANCELLED') {
      await reservationRepository.update(id, { status: 'CANCELLED' });
      return reservationRepository.findById(id);
    }

    if (current === 'CANCELLED' && newStatus === 'CONFIRMED') {
      await reservationRepository.update(id, { status: 'CONFIRMED' });
      return reservationRepository.findById(id);
    }

    if (current === 'CANCELLED' && newStatus === 'PENDING') {
      await reservationRepository.update(id, { status: 'PENDING' });
      return reservationRepository.findById(id);
    }

    throw Object.assign(
      new Error(`Cannot transition from ${current} to ${newStatus}`),
      { status: 422 }
    );
  }

  async confirmReservation(id, user) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw Object.assign(new Error('Reservation not found'), { status: 404 });
    }

    await reservationRepository.update(id, { status: 'CONFIRMED' });

    return reservationRepository.findById(id);
  }

  async getUserReservations(_userId, _requestingUser) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new ReservationService();
