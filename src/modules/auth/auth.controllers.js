const Users = require("./users.model");
const bcrypt = require("bcryptjs");
const wrapper = require("../../utils/wrapper");
const { generateToken, generateRefreshToken, verifyToken } = require("../../middlewares/jwt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username } });
    if (!user) throw new Error("User not found");

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

module.exports = { login, refreshToken };
