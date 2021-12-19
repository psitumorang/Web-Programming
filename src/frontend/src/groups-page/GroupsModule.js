const database = require('../DatabaseModule');

const createGroup = async (changeState,
  groupName,
  groupCreator,
  groupDescription,
  isPublic,
  topic1,
  topic2,
  topic3) => {
  const newGroup = {
    group_name: groupName,
    group_creator: groupCreator,
    group_description: groupDescription,
    is_public: isPublic,
    topic_1: topic1,
    topic_2: topic2,
    topic_3: topic3,
  };

  const response = await database.sendPostRequest('http://localhost:8080/groups', newGroup);
  if (response.err === undefined) {
    changeState({ link: '/groups' });
  } else {
    changeState({ link: '/error' });
  }
};

const getGroups = async (changeState) => {
  const response = await database.sendGetGroupsRequest('http://localhost:8080/groups');
  if (response.err === undefined) {
    changeState({ link: '/groups' });
  } else {
    changeState({ link: '/error' });
  }

  return response;
};

const getGroupMemberships = async (userId) => {
  const response = await database.sendGetRequest(`http://localhost:8080/membership-of-user/${userId}`);
  return response;
};

const getAdmins = async () => {
  const response = await database.sendGetRequest('http://localhost:8080/admins');

  return response;
};

const parseGroups = (changeState, groups, admins, groupMemberships) => {
  // remove all children in the box
  const element = document.getElementById('groups-area');

  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  const groupMembershipsSimplifiedArray = [];
  for (let i = 0; i < groupMemberships.length; i += 1) {
    groupMembershipsSimplifiedArray.push(groupMemberships[i].group_id);
  }

  // filter groups to only be those in which the user is a member
  const filteredGroups = [];
  for (let i = 0; i < groups.length; i += 1) {
    const groupId = groups[i].group_id;
    if (groupMembershipsSimplifiedArray.includes(groupId)) {
      filteredGroups.push(groups[i]);
    }
  }

  console.log('filteredGroupMemberships is: ', filteredGroups);
  console.log('original groups is: ', groups);

  // then add all the groups
  for (let i = 0; i < filteredGroups.length; i += 1) {
    const group = filteredGroups[i];

    let adminLst = '';
    const list = admins[group.group_id];
    list.forEach((admin) => {
      adminLst += (adminLst === '' ? `${admin}` : `, ${admin}`);
    });

    const groupId = group.group_id;
    const groupName = group.group_name;
    const groupDescription = group.group_description;
    const isPublic = (group.is_public === 1) ? 'Public' : 'Private';

    // eslint-disable-next-line prefer-template
    const groupBlock = '<div class="group-container">'
    + '<div class="group-info">'
    + '<ul>'
    + '<li id="group-id">Group Id: '
    + groupId
    + '</li>'
    + '<li id="group-name">Group Name: '
    + groupName
    + ' </li>'
    + '<li id="group-description">Group Description: '
    + groupDescription
    + '</li>'
    + '<li id="group-admins">Admins: '
    + adminLst
    + '</li>'
    + '<li id="is-public">'
    + isPublic
    + '</li>'
    + '</ul>'
    + '</div>'
    + '<button class="join-button"> View Group </button>'
    + '</div>';

    const div = document.createElement('div');
    div.innerHTML = groupBlock;
    div.onclick = () => {
      changeState({ link: '/viewgroup', viewingGroup: groupId });
    };

    document.getElementById('groups-area').appendChild(div);
  }
};

// request to join the group - note uses the invitations workflow,
// treating a request as an accepted (but not yet approved) invitation
const requestJoinGroup = async (userId, groupId, updateMessage) => {
  const groupMembers = await database.sendGetRequest(`http://localhost:8080/membership/${groupId}`);
  const groupInvitations = await database.sendGetRequest(`http://localhost:8080/invitations-open/${groupId}`);
  const groupAdmins = await database.sendGetRequest(`http://localhost:8080/admins/${groupId}`);

  // console log testing
  console.log('group members:', groupMembers);
  console.log('groupInvitations: ', groupInvitations);
  console.log('groupAdmins: ', groupAdmins);

  // check if in group already
  for (let i = 0; i < groupMembers.length; i += 1) {
    if (groupMembers[i].member_id === userId) {
      updateMessage('You\'re already a member of this group!');
      return;
    }
  }

  // check if already have an open invite
  for (let i = 0; i < groupInvitations.length; i += 1) {
    if (groupInvitations[i].to_user_id === userId) {
      updateMessage('You\'ve already got an open request or invitation to this group!');
      return;
    }
  }

  // check if already an admin
  for (let i = 0; i < groupAdmins.length; i += 1) {
    if (groupAdmins[i].admin_id === userId) {
      updateMessage('You\'re already an admin of this group!');
      return;
    }
  }

  const newRequestObj = {
    fromUserId: 1000000,
    toUserId: userId,
    groupId,
    invitationStatus: 'accepted',
  };

  updateMessage('Successfully requested to join - await approval!');
  await database.sendPostRequest('http://localhost:8080/invitations/', newRequestObj);
};

const nonMemberPublicGroups = async (groupMemberships, groups) => {
  // delete any existing children in the inner html
  const element = document.getElementById('groups-area-non-member');
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // simplify groupMembershipsArray to be just ids
  const groupMembershipsSimplifiedArray = [];
  for (let i = 0; i < groupMemberships.length; i += 1) {
    groupMembershipsSimplifiedArray.push(groupMemberships[i].group_id);
  }

  console.log('in groupsmodulechecking nonmember section, simplied array is: ', groupMembershipsSimplifiedArray);

  // filter groups data, taking only groups that (a) the user is NOT in and (b) that are public
  const publicGroupsUserNotIn = [];
  for (let i = 0; i < groups.length; i += 1) {
    console.log('in loop checking group[i].group_id', groups[i].group_id);
    if (!(groupMembershipsSimplifiedArray.includes(groups[i].group_id))) {
      if (groups[i].is_public === 1) {
        publicGroupsUserNotIn.push(groups[i]);
      }
    }
  }

  console.log('in groupsmodulechecking nonmember section, final array is: ', publicGroupsUserNotIn);

  // return Array
  return publicGroupsUserNotIn;
};

module.exports = {
  createGroup,
  getGroups,
  parseGroups,
  getAdmins,
  getGroupMemberships,
  nonMemberPublicGroups,
  requestJoinGroup,
};
