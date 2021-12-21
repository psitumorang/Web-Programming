const { createHash } = require('crypto');
const database = require('../DatabaseModule');
const lib = require('../registration-page/RegistrationModule');

const verifyUser = async (changeState, username, password, addAttempt, attempt) => {
  const newUser = {
    user_name: username,
    user_password: createHash('sha256').update(password).digest('hex'),
    attempt,
  };

  const user = await database.sendPostRequest('/login', newUser);
  if (user.err === undefined) {
    // TODO: will eventually have to send the profile to the MainPage state (from response)
    changeState({ link: '/main', userId: user.profile[0].user_id, username: newUser.user_name });
    // eslint-disable-next-line no-console
    console.log(`userid is: ${user.profile[0].user_id}`);
  } else if (user.err.includes('locked') || user.err.includes('jail')) {
    changeState({ link: '/locked' });
  } else {
    addAttempt(attempt + 1);
    changeState({ link: '/error' });
  }
};

const changePassword = async (changeState, username, password1, password2) => {
  if (lib.validatePassword(changeState, password1, password2, '/loginchangepassword/invalid')) {
    const toUserId = await database.sendGetRequest(`/user-by-name/${username}`);
    if (toUserId.length === 0) {
      changeState({ link: '/loginchangepassword/user' });
      return;
    }

    await database.sendPutRequest(`/user/${toUserId[0].user_id}`, { user_password: createHash('sha256').update(password1).digest('hex') });

    changeState({ link: '/' });
  }
};

module.exports = { verifyUser, changePassword };
