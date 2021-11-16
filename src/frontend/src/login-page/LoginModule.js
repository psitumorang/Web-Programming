const { createHash } = require('crypto');
const database = require('../DatabaseModule');

const verifyUser = async (changeLink, username, password) => {
  const newUser = {
    user_name: username,
    user_password: createHash('sha256').update(password).digest('hex'),
  };
  const user = await database.sendPostRequest('http://localhost:8080/login', newUser);
  if (user.err === undefined) {
    // TODO: will eventually have to send the profile to the MainPage state (from response)
    changeLink('/main');
  } else {
    changeLink('/error');
  }
};

module.exports = { verifyUser };
