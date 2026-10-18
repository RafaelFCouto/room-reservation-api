const reservationRepository = require('../repositories/reservation-repository');
const { Reservation }       = require('../db/index');

const { invalid } = require('../utils/input');
const { PENDING, CONFIRMED, CANCELLED } = Reservation.STATUS;
const TRANSITIONS = Object.freeze({
  [PENDING]: [CONFIRMED, CANCELLED],
  [CONFIRMED]: [CANCELLED],
  [CANCELLED]: [CONFIRMED, PENDING],
});

class ReservationService {
  async createReservation(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async cancelReservation(_id, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async updateReservationStatus(id, newStatus, _user) {
    if (!Object.values(Reservation.STATUS).includes(newStatus)) {
      throw invalid('Invalid reservation status');
    }
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw Object.assign(new Error('Reservation not found'), { status: 404 });
    }
    if (!TRANSITIONS[reservation.status]?.includes(newStatus)) {
      throw Object.assign(new Error('Cannot transition from ' + reservation.status + ' to ' + newStatus), { status: 422 });
    }
    return this.saveStatus(id, newStatus);
  }

  async confirmReservation(id, _user) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw Object.assign(new Error('Reservation not found'), { status: 404 });
    }
    return this.saveStatus(id, Reservation.STATUS.CONFIRMED);
  }

  async saveStatus(id, status) {
    await reservationRepository.update(id, { status });
    return reservationRepository.findById(id);
  }

  async getUserReservations(_userId, _requestingUser) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new ReservationService();
