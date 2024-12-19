const Users = require("../modules/users/users.model");
const Person = require("../modules/persons/persons.model");

Users.hasMany(Person, { foreignKey: "user_id" });
Person.belongsTo(Users, { foreignKey: "friend_id" });

module.exports = { Users, Person };
