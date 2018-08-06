const mongoose = require('mongoose');
require('../models/User');
const User = require('../models/User.js')
// Remove all sockets on server Reboot
module.exports.removeSockets = async () => {
  const allUsers = await User.find({});
  allUsers.forEach(async user => {
    await user.update({ $set: { socket: [] } });
  });
};
