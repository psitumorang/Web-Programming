const { createHash } = require('crypto');
const database = require('../DatabaseModule');

const validatePassword = (changeLink, password1, password2) => {
  if (password1 !== password2) {
    changeLink('/registration/invalid');
    return false;
  }
  return true;
};

const createAccount = async (changeLink, username, password1, password2) => {
  if (validatePassword(changeLink, password1, password2)) {
    // eslint-disable-next-line

    // username is not taken, we can create the account and empty profile!
    const newUser = {
      user_name: username,
      user_password: createHash('sha256').update(password1).digest('hex'),
    };
    const response = await database.createUser(newUser);
    if (response.err === undefined) {
      changeLink('/');
    } else {
      changeLink('/registration/user');
    }
  }
};

module.exports = {
  validatePassword,
  createAccount,
};
