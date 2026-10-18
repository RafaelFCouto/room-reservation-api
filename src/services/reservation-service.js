const reservationRepository = require('../repositories/reservation-repository');
const userRepository        = require('../repositories/user-repository');

class ReservationService {
  async createReservation(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
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

  async getUserReservations(userId, _requestingUser) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }
    return reservationRepository.findByUserId(userId);
  }
}

module.exports = new ReservationService();
