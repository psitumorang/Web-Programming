const database = require('../DatabaseModule');

const changeSelected = (updateSelected) => {
  updateSelected(document.getElementById('topics').value);
};

const getFilterOptions = async (setFilters) => {
  const topics = await database.sendGetRequest('http://localhost:8080/topics');
  console.log(topics);
  setFilters(topics.topics);
};

const parseFilters = (filters) => {
  let output = '';
  for (let i = 0; i < filters.length; i += 1) {
    output += `<option value=${filters[i]} name=${filters[i]}>${filters[i]}</option>`;
  }
  return output;
};

const getFilteredGroups = async (filter) => {
  let groups = {};
  if (filter === '') {
    groups = await database.sendGetRequest('http://localhost:8080/topics/all');
  } else {
    groups = await database.sendGetRequest(`http://localhost:8080/topics/${filter}`);
  }
  console.log(groups);
  console.log(groups.groups);
  return groups.groups;
};

const parseFilteredGroups = (groups, changeState, selected) => {
  // remove all children in the box
  const element = document.getElementById('groups-area');

  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  console.log('original groups is: ', groups[0], groups.length);

  // then add all the groups
  for (let i = 0; i < groups[0].length; i += 1) {
    const group = groups[0][i];
    const groupId = group.group_id;
    const groupName = group.group_name;
    const groupDescription = group.group_description;
    const isPublic = (group.is_public === 1) ? 'Public' : 'Private';

    let topicsLst = '';
    if (group.topics) {
      const list = group.topics;
      list.forEach((topic) => {
        topicsLst += (topicsLst === '' ? `${topic}` : `, ${topic}`);
      });
    } else {
      topicsLst = selected;
    }

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
    + '<li id="topics">Topics: '
    + topicsLst
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

module.exports = {
  changeSelected,
  parseFilters,
  getFilterOptions,
  getFilteredGroups,
  parseFilteredGroups,
};
