const { createHash } = require('crypto');
const database = require('../DatabaseModule');

const validatePassword = (changeState, password1, password2) => {
  if (password1 !== password2) {
    changeState({ link: '/registration/invalid' });
    return false;
  }
  return true;
};

const createAccount = async (changeState, username, password1, password2) => {
  if (validatePassword(changeState, password1, password2)) {
    // username is not taken, we can create the account and empty profile!
    const newUser = {
      user_name: username,
      user_password: createHash('sha256').update(password1).digest('hex'),
    };
    const response = await database.sendPostRequest('http://localhost:8080/registration', newUser);
    if (response.err === undefined) {
      changeState({ link: '/' });
    } else {
      changeState({ link: '/registration/user' });
    }
  }
};

module.exports = {
  validatePassword,
  createAccount,
};
