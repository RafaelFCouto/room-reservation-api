const { User } = require('../db/index');

class UserRepository {
  findById(id) {
    return User.findByPk(id);
  }
}

module.exports = new UserRepository();
