const { db } = require("../../NOSQL/database/connection");

exports.checkEmail = async (email) => {
  const getUsers = await db.User.findOne({ email });
  return getUsers;
};

exports.createUser = async (body) => {
  const newUser = await db.User.create(body);
  return newUser;
};

exports.updateUser = async (userCode, body) => {
  const updatedUser = await db.User.findOneAndUpdate(
    { userCode },
    { ...body },
    { new: true }
  ).lean();
  return updatedUser;
};
