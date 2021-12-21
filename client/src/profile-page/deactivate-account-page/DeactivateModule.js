const { sendDeleteRequest } = require('../../DatabaseModule');

/** const getCreatorGroups = (userId) => {
  // get creator groups

  return [userId];
}; */

const deleteOpenInvitations = async (userId, urlStem) => {
  // do a delete
  const url = `${urlStem}invitations/${userId}`;
  await sendDeleteRequest(url);
};

const deleteGroupMemberships = async (userId, urlStem) => {
  // do a delete
  const url = `${urlStem}membership/${userId}`;
  await sendDeleteRequest(url);
};

const deleteAdminRoles = async (userId, urlStem) => {
  // do a delete
  const url = `${urlStem}admins/${userId}`;
  await sendDeleteRequest(url);
};

const deleteProfileInfo = async (userId, urlStem) => {
  // do a delete
  const url = `${urlStem}profile/${userId}`;
  await sendDeleteRequest(url);
};

const deleteUserInfo = async (userId, urlStem) => {
  // do a delete
  const url = `${urlStem}user/${userId}`;
  await sendDeleteRequest(url);
};

const deactivateAccount = async (userId, updateMessage, changeState) => {
  const urlStem = '/';

  /**
  // check if a creator of any groups
  let createdGroups = [];
  getCreatorGroups(userId, urlStem);
  if (createdGroups.length > 0) {
    updateMessage('Can\'t deactivate this account. It has created a group.');
    return;
  }
   */

  // delete invitations
  await deleteOpenInvitations(userId, urlStem);

  // delete group memberships
  await deleteGroupMemberships(userId, urlStem);

  // delete admins - check if group creator
  await deleteAdminRoles(userId, urlStem);

  // delete profile information
  await deleteProfileInfo(userId, urlStem);

  // delete user information
  await deleteUserInfo(userId, urlStem);

  // update message
  updateMessage('Account deactivated successfully. You will be rerouted to the login page');

  // reroute to main page
  changeState({ link: '/' });
};

module.exports = { deactivateAccount };
