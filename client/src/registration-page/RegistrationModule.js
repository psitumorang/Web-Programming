const { createHash } = require('crypto');
const database = require('../DatabaseModule');

const validatePassword = (changeState, password1, password2, link) => {
  if (password1 !== password2) {
    changeState({ link });
    return false;
  }
  return true;
};

const createAccount = async (changeState, username, password1, password2) => {
  if (validatePassword(changeState, password1, password2, '/registration/invalid')) {
    // username is not taken, we can create the account and empty profile!
    const newUser = {
      user_name: username,
      user_password: createHash('sha256').update(password1).digest('hex'),
    };
    const response = await database.sendPostRequest('/registration', newUser);
    if (response.err === undefined) {
      changeState({ link: '/' });
    } else {
      changeState({ link: '/registration/user' });
    }
  }
};

export {
  validatePassword,
  createAccount,
};
