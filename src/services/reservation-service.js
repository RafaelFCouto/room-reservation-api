const reservationRepository = require('../repositories/reservation-repository');
const { Reservation }       = require('../db/index');

class ReservationService {
  async createReservation(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async cancelReservation(id, user) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw Object.assign(new Error('Reservation not found'), { status: 404 });
    }

    await reservationRepository.update(id, { status: Reservation.STATUS.CANCELLED });

    return reservationRepository.findById(id);
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
