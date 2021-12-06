const database = require('../DatabaseModule');

const getGroup = async (id) => {
  const response = await database.sendGetGroupsRequest(`http://localhost:8080/groups/${id}`);

  // eslint-disable-next-line no-console
  console.log(response);
  return response;
};

const getAdmins = async (id) => {
  const response = await database.sendGetRequest(`http://localhost:8080/admins/${id}`);

  // eslint-disable-next-line no-console
  console.log(response);
  return response;
};

const revokeAdmin = async (state, changeState, groupAndAdmins) => {
  const response = await database.sendDeleteRequest(`http://localhost:8080/admins?groupId=${state.viewingGroup}&adminUser=${document.getElementById('revokeAdmin').value}&groupName=${groupAndAdmins.group.group_name}`);

  if (typeof response.message !== 'undefined') {
    changeState({ link: '/viewgroup/error' });
  }

  // eslint-disable-next-line no-console
  console.log(response);
  return response;
};

const addAdmin = async (groupAndAdmins) => {
  const response = await database.sendPostRequest('http://localhost:8080/admins', {
    admin: {
      adminUser: document.getElementById('addAdmin').value,
      groupId: groupAndAdmins.group.group_id,
      isCreator: 0,
      groupName: groupAndAdmins.group.group_name,
    },
  });

  // eslint-disable-next-line no-console
  console.log(response);
  return response;
};

module.exports = {
  getGroup,
  getAdmins,
  revokeAdmin,
  addAdmin,
};
