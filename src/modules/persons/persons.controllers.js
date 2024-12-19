const { Users, Person } = require("../../config/assosiations");
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
      include: [
        {
          model: Users,
          attributes: ["fullname", "username", "photo"],
        },
      ],
    });

    const newPersons = persons.map((person) => {
      return {
        ...person.dataValues,
        friend_photo: person.dataValues.user.photo ? `http://${process.env.MINIO_ENDPOINT}/${person.dataValues.user.photo}` : null,
        friend_username: person.dataValues.user.username,
      };
    });

    return wrapper.paginationResponse(res, newPersons, newPersons.length, page, limit, "Friends fetched successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const getPersonByPin = async (req, res) => {
  try {
    const { pin } = req.params;
    const getUser = await Users.findOne({ where: { pin } });
    if (!getUser) throw new Error("User not found");

    getUser.dataValues.photo = getUser.dataValues.photo ? `http://${process.env.MINIO_ENDPOINT}/${getUser.dataValues.photo}` : null;
    return wrapper.successResponse(res, getUser, "User fetched successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { addPerson, getPersons, getPersonByPin };
