const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./database")[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: false,
  dialectOptions: config.dialectOptions,
});

testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, testConnection };
