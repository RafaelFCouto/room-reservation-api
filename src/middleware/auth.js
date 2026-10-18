const userService = require('../services/user-service');
const { positiveId } = require('../utils/input');

async function authenticate(req, res, next) {
  let userId;
  try {
    userId = positiveId(req.headers['x-user-id']);
  } catch {
    return res.status(401).json({ error: 'Missing or invalid X-User-Id header' });
  }

  try {
    const user = await userService.findById(userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = authenticate;
