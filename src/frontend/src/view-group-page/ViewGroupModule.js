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

const createPost = async (changeState, postGroup, postingUser, caption) => {
  const newPost = {
    post_group: postGroup,
    posting_user: postingUser,
    // eslint-disable-next-line
    caption: caption,
  };
  // eslint-disable-next-line no-console
  console.log(newPost);
  // eslint-disable-next-line
  const response = await database.sendPostRequest('http://localhost:8080/post', newPost);

  // eslint-disable-next-line no-console
  console.log(response);
  /*
  if (response.err === undefined) {
    changeState({ link: '/groups' });
  } else {
    changeState({ link: '/error' });
  }
  */
};

const getPosts = async (changeState, groupId) => {
  // eslint-disable-next-line no-console
  console.log(groupId);
  const response = await database.sendGetRequest(`http://localhost:8080/posts/${groupId}`);

  /*
  if (response.err === undefined) {
    changeState({ link: '/groups' });
  } else {
    changeState({ link: '/error' });
  }
  */

  // eslint-disable-next-line no-console
  console.log(response);
  return response;
};

const parsePosts = (posts) => {
  // remove all children in the box
  const element = document.getElementById('posts-area');

  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // then add all the groups
  for (let i = 0; i < posts.length; i += 1) {
    const post = posts[i];
    const postId = post.post_id;
    const postingUser = post.posting_user;
    // eslint-disable-next-line prefer-destructuring
    const caption = post.caption;

    // eslint-disable-next-line prefer-template
    const postBlock = '<div class="post-container">'
    + '<div class="post-info">'
    + '<ul>'
    + '<li id="post-id">Post Id: '
    + postId
    + '</li>'
    + '<li id="posting-user">Posting User: '
    + postingUser
    + ' </li>'
    + '<li id="caption">Caption: '
    + caption
    + '</li>'
    + '</ul>'
    + '</div>'
    + '<button class="reply-button"> Reply </button>'
    + '</div>';

    const div = document.createElement('div');
    div.innerHTML = postBlock;
    /*
    div.onclick = () => {
      changeState({ link: '/viewgroup', viewingGroup: groupId });
    };
    */

    document.getElementById('posts-area').appendChild(div);
  }
};

module.exports = {
  getGroup,
  getAdmins,
  revokeAdmin,
  addAdmin,
  createPost,
  getPosts,
  parsePosts,
};
