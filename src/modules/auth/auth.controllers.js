const Users = require("../users/users.model");
const bcrypt = require("bcryptjs");
const wrapper = require("../../utils/wrapper");
const { generateToken, generateRefreshToken } = require("../../middlewares/jwt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/email");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error("Email has not been registered");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    const token = generateToken({ id: user.dataValues.id });

    return wrapper.successResponse(res, { token }, "Login success", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new Error("Token not found");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const refreshToken = generateRefreshToken({ id: decoded.id });

    return wrapper.successResponse(res, { refreshToken }, "Refresh token success", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const register = async (req, res) => {
  try {
    const { password, fullname, email } = req.body;

    const isEmailExist = await Users.findOne({ where: { email } });
    if (isEmailExist) throw new Error("Email already exist");

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      password: hashedPassword,
      fullname,
      email,
      pin: crypto.randomBytes(4).toString("hex"),
      updatedAt: null,
    };

    const user = await Users.create(payload);
    delete user.dataValues.password;
    return wrapper.successResponse(res, user, "Register success", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error("Email has not been registered");

    const resetCode = crypto.randomBytes(4).toString("hex");
    await sendEmail(email, "Reset Password", `Your reset code is ${resetCode}`);

    return wrapper.successResponse(res, null, "Reset password success", 200);
  } catch (error) {
    return wrapper.errorResponse(res, error.message, 400);
  }
};

module.exports = { login, refreshToken, register, resetPassword };
