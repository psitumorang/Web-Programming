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

const putDecline = async (invitationId) => {
  const result = await database.sendPutRequest(`http://localhost:8080/invitations/${invitationId}`, { newStatus: 'declined' });
  return result;
};

const declineInvite = async (invitationId, invitationName, updateInvitations, updateMessage) => {
  // update operation on invitation to set the status to declined
  const result = await putDecline(invitationId);

  // update message
  updateMessage(`Declined invitation to  ${invitationName}`);

  // refetch/update invitations
  updateInvitations();
  return result;
};

const acceptHTTP = async (invitationId, groupId, userId) => {
  // update group in db
  const groupMembershipURL = `http://localhost:8080/membership/${groupId}`;
  const resultGroupMember = await database.sendPostRequest(groupMembershipURL, { userId });

  // update invitation in db
  const invitationURL = `http://localhost:8080/invitations/${invitationId}`;
  const invitationBody = { newStatus: 'accepted' };
  const resultInv = await database.sendPutRequest(invitationURL, invitationBody);

  // refetch/update invitations
  return [resultGroupMember, resultInv];
};

const acceptInvite = async (invitation, updateInvitations, updateMessage, userId) => {
  // update operation on invitation to set the status to declined
  const result = await acceptHTTP(invitation.invitation_id, invitation.group_id, userId);

  // update message
  updateMessage(`Accepted invitation to  ${invitation.groupName}. You can engage in the group from the groups page!`);

  // refetch/update invitations
  updateInvitations();

  return result;
};

module.exports = {
  getPendingInvitations,
  getGroupNames,
  declineInvite,
  acceptInvite,
};
