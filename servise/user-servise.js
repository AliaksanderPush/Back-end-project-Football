const UserModel = require("../models/user-model");
//const uuid = require("uuid");
//const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/User-dto");
const bcrypt = require("bcrypt");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(userName, email, password) {
    const candidate = await UserModel.findOne({ email });
    const candidateName = await UserModel.findOne({ userName });
    if (candidate || candidateName) {
      throw ApiError.BadRequest(
        `The user with this ${email} or ${userName} already exists`
      );
    } else {
      const hashPassword = await bcrypt.hash(password, 3);
      const user = await UserModel.create({
        userName,
        email,
        password: hashPassword,
      });
      user.isActivated = true;
      await user.save();

      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return { ...tokens, user: userDto };
    }
  }
  async activate() {
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("The user with this email was not found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Invalid password!");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.Unouthorizederror();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.Unouthorizederror();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}
module.exports = new UserService();
