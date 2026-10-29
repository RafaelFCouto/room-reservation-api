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
  // Regras aplicaveis: RN-01, RN-02, RN-03, RN-04, RN-06 (docs/regras_negocio.md).
  async createReservation(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  // Regras aplicaveis: RN-05 (docs/regras_negocio.md).
  async cancelReservation(_id, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  // Regras aplicaveis: RN-05, RN-06 (docs/regras_negocio.md).
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

  // Regras aplicaveis: RN-06 (docs/regras_negocio.md).
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
