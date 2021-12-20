const database = require('../DatabaseModule');

const getGroupAnalyticsFacts = async () => {
  const groupAnalyticsFacts = await database.sendGetRequest('http://localhost:8080/analytics-groups');
  return groupAnalyticsFacts;
};

const getPostAnalyticsFacts = async () => {
  const postAnalyticsFacts = await database.sendGetRequest('http://localhost:8080/analytics-posts');
  return postAnalyticsFacts;
};

module.exports = {
  getGroupAnalyticsFacts,
  getPostAnalyticsFacts,
};
