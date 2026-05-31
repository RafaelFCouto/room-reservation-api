const userService = require('../services/user-service');

async function authenticate(req, res, next) {
  const userId = parseInt(req.headers['x-user-id']);

  if (!userId || isNaN(userId)) {
    return res.status(401).json({ error: 'Missing or invalid X-User-Id header' });
  }

  const user = await userService.findById(userId);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = user;
  next();
}

module.exports = authenticate;
