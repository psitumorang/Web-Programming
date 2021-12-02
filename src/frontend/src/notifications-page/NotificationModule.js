const database = require('../DatabaseModule');

const getNotifications = async (id) => {
  const response = await database.sentGetRequest(`http://localhost:8080/notifications/`, {id: id});
  if (response.err === undefined) {
    // eslint-disable-next-line no-console
    console.log(response);
    return response;
  } else {
    return null;
  }
};

module.exports = {
  getNotifications
};
