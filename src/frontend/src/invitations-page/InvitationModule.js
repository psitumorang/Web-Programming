const database = require('../DatabaseModule');

const getPendingInvitations = async (id) => {
  const response = await database.sendGetRequest('http://localhost:8080/invitations/', { id });
  return response;
};

// get group names associated with group_id
const getGroupNames = async (invitations) => {
  // build array of promises for each invitation
  const groupNamePromises = [];
  for (let i = 0; i < invitations.length; i += 1) {
    const groupName = database.sendGetRequest('http://localhost:8080/groups/', { id: invitations[i].group_id });
    groupNamePromises.push(groupName);

    // if there is an error for any of them, return it
    if (groupName.err !== undefined) {
      // eslint-disable-next-line no-console
      console.log(groupName.err);
      return groupName;
    }
  }

  // await for all promises to resolve
  const groupNameArray = await Promise.all(groupNamePromises);

  const invitationsLocal = invitations;
  // loop through, adding group names to each invitation object
  for (let j = 0; j < groupNameArray.length; j += 1) {
    invitationsLocal[j].groupName = groupNameArray[j].group_name;
  }

  return invitationsLocal;
};

module.exports = {
  getPendingInvitations,
  getGroupNames,
};
