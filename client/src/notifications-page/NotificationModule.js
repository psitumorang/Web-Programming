const database = require('../DatabaseModule');

const getNotifications = async (id) => {
  const response = await database.sendGetRequest('/notifications/', { id });
  if (response.err === undefined) {
    // eslint-disable-next-line no-console
    console.log(response);
    return response;
  }
  return null;
};

export default getNotifications;
