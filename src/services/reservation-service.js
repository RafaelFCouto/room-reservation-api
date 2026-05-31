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

  async getUserReservations(_userId, _requestingUser) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new ReservationService();
