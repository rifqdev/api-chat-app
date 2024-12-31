const Users = require("../modules/users/users.model");
const Person = require("../modules/persons/persons.model");
const Chats = require("../modules/chats/chats.model");
Users.hasMany(Person, { foreignKey: "user_id" });
Person.belongsTo(Users, { foreignKey: "friend_id" });
Chats.belongsTo(Users, { foreignKey: "sender", as: "userInfo" });
Chats.belongsTo(Users, { foreignKey: "friend_id", as: "friendInfo" });

module.exports = { Users, Person, Chats };
