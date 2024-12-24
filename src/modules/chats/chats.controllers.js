const Chats = require("./chats.model");
const wrapper = require("../../utils/wrapper");
const { Op } = require("sequelize");

const insertChat = async (data) => {
  try {
    const payload = {
      user_id: data.sender,
      sender: data.sender,
      friend_id: data.to,
      message: data.message,
    };

    await Chats.create(payload);
  } catch (error) {
    console.log(error);
  }
};

const getHistoryChats = async (req, res) => {
  try {
    const { id } = req.user;
    const { friend_id } = req.params;

    const chats = await Chats.findAll({
      where: {
        [Op.or]: [
          { user_id: id, friend_id },
          { user_id: friend_id, friend_id: id },
        ],
      },
      order: [["createdAt", "asc"]],
    });

    return wrapper.successResponse(res, chats, "Chats fetched successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { insertChat, getHistoryChats };
