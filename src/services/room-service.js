class RoomService {
  async getAvailableRooms(_startTime, _endTime) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async createRoom(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new RoomService();
