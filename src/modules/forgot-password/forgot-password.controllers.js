const Users = require("../users/users.model");
const ForgotPassCode = require("./forgot-password.model");
const wrapper = require("../../utils/wrapper");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/email");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error("Email has not been registered");

    const resetCode = crypto.randomBytes(4).toString("hex");
    await sendEmail(email, "Reset Password", `Your reset code is ${resetCode}. This code will expired in 10 minutes`);

    const payload = {
      user_id: user.dataValues.id,
      code: resetCode,
      expired_at: new Date(Date.now() + 10 * 60 * 1000),
    };

    await ForgotPassCode.create(payload);

    return wrapper.successResponse(res, null, "code has been sent to your email", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { code, new_password } = req.body;

    const forgotPassCode = await ForgotPassCode.findOne({ where: { code } });
    if (!forgotPassCode) throw new Error("Code not found");

    if (forgotPassCode.dataValues.expired_at < new Date()) throw new Error("Code has expired");

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const result = await Users.update({ password: hashedPassword }, { where: { id: forgotPassCode.dataValues.user_id } });
    if (!result) throw new Error("Failed to update password");

    await ForgotPassCode.destroy({ where: { id: forgotPassCode.dataValues.id } });
    return wrapper.successResponse(res, null, "Password has been updated", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error("Email has not been registered");

    const resetCode = crypto.randomBytes(4).toString("hex");
    await sendEmail(email, "Reset Password", `Your reset code is ${resetCode}. This code will expired in 10 minutes`);

    await ForgotPassCode.create({
      user_id: user.dataValues.id,
      code: resetCode,
      expired_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    return wrapper.successResponse(res, null, "Code has been sent to your email", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { resetPassword, updatePassword, resendCode };
