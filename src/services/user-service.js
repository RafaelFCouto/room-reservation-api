const userRepository = require('../repositories/user-repository');

class UserService {
  async findById(id) {
    return userRepository.findById(id);
  }
}

module.exports = new UserService();
