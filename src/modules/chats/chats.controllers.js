const Chats = require("./chats.model");
const wrapper = require("../../utils/wrapper");

const insertChat = async (data) => {
  try {
    const payload = {
      user_id: data.sender,
      friend_id: data.to,
      message: data.message,
    };

    await Chats.create(payload);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { insertChat };
