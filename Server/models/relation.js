const sequelize = require("../utils/db-connection");
const users = require("./user");
const messages = require("./message");
const groups = require("./group");

users.hasMany(messages);
messages.belongsTo(users);

/*many to many relation between users and groups through a junction table user_groups*/
users.belongsToMany(groups, { through: "user_groups" });
groups.belongsToMany(users, { through: "user_groups" });



module.exports={users,messages};