const sequelize = require("../utils/db-connection");
const users = require("./user");
const messages = require("./message");

users.hasMany(messages);
messages.belongsTo(users);

module.exports={users,messages};