const User = require('../models/User');
const ApiError = require('../utils/ApiError');

exports.createUser = async (userData) => {
  if (await User.findOne({ email: userData.email })) {
    throw new ApiError(400, 'Email already taken');
  }
  return await User.create(userData);
};

exports.loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  return user;
};
