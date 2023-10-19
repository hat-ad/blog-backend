const Bcryptjs = require("bcryptjs");
const { OK, ERROR } = require("../../../utils/responseHelper");
const { GenerateToken, verifyGoogleToken } = require("../functions/function");
const UserService = require("../services/user.service");

exports.createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await UserService.checkEmail(email);
    if (user) {
      return ERROR(res, user, "email already Exists!");
    }
    const hashPassword = await Bcryptjs.hash(password, 12);

    const body = {
      email,
      password: hashPassword,
      name,
      is_active: true,
    };
    const newUser = await UserService.createUser(body);
    const token = GenerateToken(newUser);

    newUser.token = token;
    await newUser.save();

    return OK(
      res,
      { user: newUser, token },
      "User Created SuccessFully, Please check your email!"
    );
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.checkEmail(email);

    if (!user) {
      return ERROR(res, null, "This User has not Registered yet");
    }

    const hashedPassword = await Bcryptjs.compare(password, user.password);
    if (!hashedPassword) return ERROR(res, user, "Invalid Password!");
    const token = GenerateToken(user);
    user.token = token;
    await user.save();

    return OK(res, { user, token }, "USER Logged in Successfully!");
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};

exports.socialLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      console.log(verificationResponse);
      if (verificationResponse.error) {
        return ERROR(res, null, verificationResponse.error);
      }
      const { payload } = verificationResponse;
      const user = await UserService.checkEmail(payload.email);

      if (!user) {
        return ERROR(res, null, "This User has not Registered yet");
      }

      const token = GenerateToken(user);
      user.token = token;
      await user.save();

      return OK(res, { user, token }, "USER Logged in Successfully!");
    }

    return ERROR(res, null, "Something went Wrong");
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};

exports.socialRegister = async (req, res) => {
  try {
    const { credential } = req.body;

    if (credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return ERROR(res, null, verificationResponse.error);
      }
      const { payload } = verificationResponse;
      const user = await UserService.checkEmail(payload.email);

      if (user) {
        return OK(
          res,
          { user, token: user.token },
          "USER Logged in Successfully!"
        );
      }
      const body = {
        email: payload.email,
        password: "",
        name: payload.name,
        is_active: true,
      };
      const newUser = await UserService.createUser(body);
      const token = GenerateToken(newUser);

      newUser.token = token;
      await newUser.save();

      return OK(
        res,
        { user: newUser, token },
        "User Created SuccessFully, Please check your email!"
      );
    }

    return ERROR(res, null, "Something went Wrong");
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};
