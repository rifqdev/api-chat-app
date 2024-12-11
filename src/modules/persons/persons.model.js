const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Person = sequelize.define(
  "persons",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    friend_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    friend_fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friend_username: {
      type: DataTypes.STRING,
    },
    friend_photo: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Person;
