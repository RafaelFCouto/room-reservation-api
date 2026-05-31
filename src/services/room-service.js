const roomRepository = require('../repositories/room-repository');

class RoomService {
  async getAvailableRooms(_startTime, _endTime) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  async createRoom(data, user) {
    const { name, capacity, building, resources, status } = data;

    if (!name || !building) {
      throw Object.assign(new Error('name and building are required'), { status: 422 });
    }

    const existingRooms = await roomRepository.findAll();
    const duplicate     = existingRooms.find(r => r.name === name);

    if (duplicate) {
      throw Object.assign(new Error('Room name already exists'), { status: 409 });
    }

    const roomsInBuilding = await roomRepository.findAll({ where: { building } });

    return roomRepository.create({
      name,
      capacity,
      building,
      resources: resources || [],
      status:    status    || 'AVAILABLE',
    });
  }
}

module.exports = new RoomService();
