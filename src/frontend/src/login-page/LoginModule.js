const { createHash } = require('crypto');
const database = require('../DatabaseModule');

const verifyUser = async (changeState, username, password) => {
  const newUser = {
    user_name: username,
    user_password: createHash('sha256').update(password).digest('hex'),
  };
  const user = await database.sendPostRequest('http://localhost:8080/login', newUser);
  if (user.err === undefined) {
    // TODO: will eventually have to send the profile to the MainPage state (from response)
    changeState({ link: '/main', userId: user.profile[0].user_id, username: user.profile[0].user_name });
    // eslint-disable-next-line no-console
    console.log(`userid is: ${user.profile[0].user_id}`);
  } else {
    changeState({ link: '/error' });
  }
};

module.exports = { verifyUser };
