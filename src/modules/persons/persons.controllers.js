const Person = require("./persons.model");
const Users = require("../auth/auth.model");
const wrapper = require("../../utils/wrapper");
const { Op } = require("sequelize");

const addPerson = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pin } = req.body;

    const getUser = await Users.findOne({ where: { pin } });
    if (!getUser) throw new Error("User not found");

    const payload = {
      user_id: userId,
      friend_id: getUser.dataValues.id,
      friend_fullname: getUser.dataValues.fullname,
      friend_username: getUser.dataValues.username || null,
      friend_photo: getUser.dataValues.photo || null,
    };

    const person = await Person.create(payload);
    return wrapper.successResponse(res, person, "Friend added successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const getPersons = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, fullname } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { user_id: userId };
    if (fullname) {
      whereClause.friend_fullname = { [Op.like]: `%${fullname}%` };
    }

    const persons = await Person.findAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return wrapper.paginationResponse(res, persons, persons.length, page, limit, "Friends fetched successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { addPerson, getPersons };
