const { Chats, Users } = require("../../config/assosiations");
const wrapper = require("../../utils/wrapper");
const { Op, Sequelize } = require("sequelize");

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

const readChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await Chats.update({ is_read: true, read_at: new Date() }, { where: { user_id: userId, id } });

    return wrapper.successResponse(res, null, "Chats read successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const getFriendChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chats.findAll({
      where: {
        [Op.or]: [{ user_id: userId }, { friend_id: userId }],
      },
      attributes: [
        [Sequelize.col("chats.sender"), "sender"],
        [Sequelize.col("chats.friend_id"), "friend_id"], // Tambahkan ke atribut untuk grouping
        [Sequelize.fn("MAX", Sequelize.col("chats.createdAt")), "last_message_at"],
        [
          Sequelize.literal(
            `(SELECT message 
              FROM chats AS c 
              WHERE 
                (c.sender = chats.sender AND c.friend_id = chats.friend_id) 
                OR (c.sender = chats.friend_id AND c.friend_id = chats.sender)
              ORDER BY c.createdAt DESC 
              LIMIT 1)`
          ),
          "last_message",
        ],
        [Sequelize.fn("COUNT", Sequelize.literal("CASE WHEN chats.is_read = false THEN 1 ELSE 0 END")), "unread_message_count"],
      ],
      include: [
        {
          model: Users,
          as: "userInfo",
          attributes: ["fullname", "photo", "id"],
        },
        {
          model: Users,
          as: "friendInfo",
          attributes: ["fullname", "photo", "id"],
        },
      ],
      group: [
        "chats.sender",
        "chats.friend_id", // Tambahkan kolom ini ke GROUP BY
        "userInfo.id",
        "friendInfo.id",
        "friendInfo.fullname",
        "friendInfo.photo",
      ],
      order: [[Sequelize.col("last_message_at"), "DESC"]],
    });

    return wrapper.successResponse(res, chats, "Chats fetched successfully", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { insertChat, getHistoryChats, readChat, getFriendChats };
