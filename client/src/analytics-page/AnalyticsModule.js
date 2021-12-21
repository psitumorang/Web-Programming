const database = require('../DatabaseModule');

const getGroupAnalyticsFacts = async () => {
  const groupAnalyticsFacts = await database.sendGetRequest('/analytics-groups');
  return groupAnalyticsFacts;
};

const getPostAnalyticsFacts = async () => {
  const postAnalyticsFacts = await database.sendGetRequest('/analytics-posts');
  return postAnalyticsFacts;
};

export {
  getGroupAnalyticsFacts,
  getPostAnalyticsFacts,
};
