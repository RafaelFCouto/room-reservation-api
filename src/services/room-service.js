const roomRepository = require('../repositories/room-repository');

const Room = require('../models/Room');
const { invalid } = require('../utils/input');

class RoomService {
  // Regras aplicaveis: RN-01, RN-06 (docs/regras_negocio.md).
  async getAvailableRooms(_startTime, _endTime) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }

  // Regras aplicaveis: RN-07 (docs/regras_negocio.md).
  async createRoom(data, _user) {
    const { name, capacity, building, resources, status } = data;

    if (typeof name !== 'string' || !name.trim() ||
        typeof building !== 'string' || !building.trim()) {
      throw invalid('name and building must be non-empty strings');
    }
    if (!Number.isSafeInteger(capacity)) throw invalid('capacity must be an integer');
    if (resources !== undefined && (!Array.isArray(resources) ||
        resources.some(resource => typeof resource !== 'string'))) {
      throw invalid('resources must be an array of strings');
    }
    if (status !== undefined && !Object.values(Room.STATUS).includes(status)) {
      throw invalid('Invalid room status');
    }
    const duplicate = await roomRepository.findByName(name.trim());

    if (duplicate) {
      throw Object.assign(new Error('Room name already exists'), { status: 409 });
    }

    return roomRepository.create({
      name: name.trim(),
      capacity,
      building: building.trim(),
      resources: resources || [],
      status:    status    ?? Room.STATUS.AVAILABLE,
    });
  }
}

module.exports = new RoomService();
