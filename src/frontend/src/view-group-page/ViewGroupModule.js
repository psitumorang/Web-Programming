const database = require('../DatabaseModule');

const getGroup = async (id) => {
  const response = await database.sendGetGroupsRequest(`http://localhost:8080/groups/${id}`);

  return response;
};

const getAdmins = async (id) => {
  const response = await database.sendGetRequest(`http://localhost:8080/admins/${id}`);

  return response;
};

const revokeAdmin = async (state, changeState, groupAndAdmins) => {
  const response = await database.sendDeleteRequest(`http://localhost:8080/admins?groupId=${state.viewingGroup}&adminUser=${document.getElementById('revokeAdmin').value}&groupName=${groupAndAdmins.group.group_name}`);

  if (typeof response.message !== 'undefined') {
    changeState({ link: '/viewgroup/error' });
  }

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

  return response;
};

const createPost = async (changeState, postGroup, postingUser, caption) => {
  const newPost = {
    post_group: postGroup,
    posting_user: postingUser,
    // eslint-disable-next-line
    caption: caption,
  };

  // eslint-disable-next-line
  const response = await database.sendPostRequest('http://localhost:8080/post', newPost);
};

const getPosts = async (changeState, groupId) => {
  const response = await database.sendGetRequest(`http://localhost:8080/posts/${groupId}`);

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
    const postBlock = `<div class="post-container" id=${postId}>`
    + '<div class="post-info">'
    + '<ul>'
    + '<li id="post-id" >Post Id: '
    + postId
    + '</li>'
    + '<li id="posting-user">Posting User: '
    + postingUser
    + '</li>'
    + '<li id="caption">Caption: '
    + caption
    + '</li>'
    + '</ul>'
    + '</div>'
    + '<div className=reply>'
    + '<input className="reply-input" type="reply" placeholder="reply to this post" />'
    + '<button type="reply-button"> Reply </button>'
    + '</div>'
    + '<div type="flag-and-delete">'
    + '<button type="delete"> Delete </button>'
    + '<button type="flag"> Flag </button>'
    + '</div>'
    + '</div>';

    const postDiv = document.createElement('div');
    postDiv.innerHTML = postBlock;

    document.getElementById('posts-area').appendChild(postDiv);
  }
};

const createReply = async (changeState, postId, postingUser, caption) => {
  const newReply = {
    post_id: postId,
    posting_user: postingUser,
    // eslint-disable-next-line
    caption: caption,
  };
  // eslint-disable-next-line no-console
  console.log(newReply);
  // eslint-disable-next-line
  const response = await database.sendPostRequest('http://localhost:8080/reply', newReply);

  // eslint-disable-next-line no-console
  console.log(response);
};

const getReplies = async (changeState, groupId) => {
  // eslint-disable-next-line no-console
  console.log(groupId);
  const response = await database.sendGetRequest(`http://localhost:8080/replies/${groupId}`);

  // eslint-disable-next-line no-console
  console.log(response);
  return response;
};

const parseReplies = (posts, replies) => {
  // iterate over all posts
  for (let i = 0; i < posts.length; i += 1) {
    const post = posts[i];
    const postId = post.post_id;

    // eslint-disable-next-line no-console
    console.log(`postid: ${postId.toString()}`);
    // eslint-disable-next-line no-console
    console.log(`postdiv: ${document.getElementById(postId.toString())}`);
    // remove all children in the box
    const element = document.getElementById(postId.toString());

    /*
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
    */

    // iterate over all replies and those that belong to the current post will be appended
    for (let j = 0; j < replies.length; j += 1) {
      const reply = replies[j];
      const replyId = reply.reply_id;
      const replyUser = reply.posting_user;
      // eslint-disable-next-line prefer-destructuring
      const caption = reply.caption;
      const replyPostId = reply.post_id;

      if (replyPostId === postId) {
        // eslint-disable-next-line prefer-template
        const replyBlock = '<div class="reply-container">'
        + '<div class="reply-info">'
        + '<ul>'
        + '<li id="reply-id" >Reply Id: '
        + replyId
        + '</li>'
        + '<li id="replying-user">Replying User: '
        + replyUser
        + '</li>'
        + '<li id="caption">Caption: '
        + caption
        + '</li>'
        + '</ul>'
        + '</div>'
        + '<div type="flag-and-delete">'
        + '<button type="delete"> Delete </button>'
        + '<button type="flag"> Flag </button>'
        + '</div>'
        + '</div>';

        const replyDiv = document.createElement('div');
        replyDiv.innerHTML = replyBlock;
        element.appendChild(replyDiv);
      }
    }
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
  createReply,
  getReplies,
  parseReplies,
};
