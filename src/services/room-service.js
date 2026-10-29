class RoomService {
  // Regras aplicaveis: RN-01, RN-06 (docs/regras_negocio.md).
  async getAvailableRooms(_startTime, _endTime) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  // Regras aplicaveis: RN-07 (docs/regras_negocio.md).
  async createRoom(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new RoomService();
