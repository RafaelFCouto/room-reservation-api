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

  async getUserReservations(userId, requestingUser) {
    const user = await userRepository.findById(userId);

    if (user.profile === 'coordinator') {
      return reservationRepository.findAll({ where: { user_id: userId } });
    }

    const allReservations = await reservationRepository.findAll();
    return allReservations.filter(r => r.user_id === parseInt(userId));
  }
}

module.exports = new ReservationService();
