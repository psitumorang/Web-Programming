/*
const parseGroups = (groups) => {
  // remove all children in the box
  const element = document.getElementById('groups-area');

  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // then add all the groups
  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i];

    const groupId = group.group_id;
    const groupName = group.group_name;
    const groupDescription = group.group_description;
    const isPublic = (group.is_public === 1) ? 'Public' : 'Private';

    // eslint-disable-next-line no-console
    console.log(groupDescription);

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
    + '<li id="is-public">'
    + isPublic
    + '</li>'
    + '</ul>'
    + '</div>'
    + '<button class="join-button"> Join Group </button>'
    + '</div>';

    const div = document.createElement('div');
    div.innerHTML = groupBlock;

    document.getElementById('groups-area').appendChild(div);
  }
};

export default parseGroups;
*/
