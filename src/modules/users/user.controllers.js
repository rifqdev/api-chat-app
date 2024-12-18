const Users = require("./users.model");
const wrapper = require("../../utils/wrapper");
const { uploadToMinio, deleteFile } = require("../../utils/upload");

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId } });
    delete user.dataValues.password;
    user.dataValues.photo = user.dataValues.photo ? `http://${process.env.MINIO_ENDPOINT}/${user.dataValues.photo}` : null;
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

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const getUser = await Users.findOne({ where: { id: userId } });

    const file = req.file;
    if (!file) {
      return wrapper.errorResponse(res, "Photo is required", 400);
    }
    const result = await uploadToMinio("chat-app-profile-picture", file.path, file.originalname);
    if (result.error) {
      return wrapper.errorResponse(res, result.error, 400);
    }
    if (getUser.photo) {
      await deleteFile("chat-app-profile-picture", getUser.dataValues.photo.split("/").pop());
    }
    const payload = {
      photo: result.url,
    };
    await Users.update(payload, { where: { id: userId } });
    return wrapper.successResponse(res, payload, "Profile picture updated successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { getUser, updateBio, updateFullname, updateUsername, updateProfilePicture };
