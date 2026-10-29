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
