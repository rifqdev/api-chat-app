const Users = require("./users.model");
const wrapper = require("../../utils/wrapper");

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId } });
    delete user.dataValues.password;
    return wrapper.successResponse(res, user, "User fetched successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const updateBio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;
    await Users.update({ bio }, { where: { id: userId } });

    const getUser = await Users.findOne({ where: { id: userId } });
    delete getUser.dataValues.password;

    return wrapper.successResponse(res, getUser, "User updated successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const updateFullname = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname } = req.body;
    await Users.update({ fullname }, { where: { id: userId } });

    const getUser = await Users.findOne({ where: { id: userId } });
    delete getUser.dataValues.password;

    return wrapper.successResponse(res, getUser, "User updated successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;
    await Users.update({ username }, { where: { id: userId } });

    const getUser = await Users.findOne({ where: { id: userId } });
    delete getUser.dataValues.password;

    return wrapper.successResponse(res, getUser, "User updated successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { getUser, updateBio, updateFullname, updateUsername };
