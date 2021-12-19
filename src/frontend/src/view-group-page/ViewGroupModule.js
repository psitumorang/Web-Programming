const database = require('../DatabaseModule');

const getGroup = async (id) => {
  const response = await database.sendGetGroupsRequest(`http://localhost:8080/groups/${id}`);

  return response;
};

const getAdmins = async (id) => {
  const response = await database.sendGetRequest(`http://localhost:8080/admins/${id}`);

  return response;
};

const revokeAdmin = async (state, changeState, groupAndAdmins, setGroupAndAdmins) => {
  const response = await database.sendDeleteRequest(`http://localhost:8080/admins?groupId=${state.viewingGroup}&adminUser=${document.getElementById('revokeAdmin').value}&groupName=${groupAndAdmins.group.group_name}`);

  if (typeof response.message !== 'undefined') {
    changeState({ link: '/viewgroup/error' });
  }

  await setGroupAndAdmins();

  return response;
};

const addAdmin = async (groupAndAdmins, setGroupAndAdmins) => {
  const response = await database.sendPostRequest('http://localhost:8080/admins', {
    admin: {
      adminUser: document.getElementById('addAdmin').value,
      groupId: groupAndAdmins.group.group_id,
      isCreator: 0,
      groupName: groupAndAdmins.group.group_name,
    },
  });

  await setGroupAndAdmins();

  return response;
};

const inviteNonAdmin = async (groupAndAdmins, state, setGroupAndAdmins) => {
  const url = 'http://localhost:8080/invitations/';
  const toUserName = document.getElementById('addNonAdmin').value;
  console.log('in viewgroupmodule/invitenonadmin, about to sendGet request with tousername of', toUserName);

  // get the userid using the username.
  // I've just used one argument because the concatenation method in DatabaseModule
  // produced some funny results. Didn't want to change it in case I broke somebody else's work!
  // So I've done the url concat here.
  const toUserId = await database.sendGetRequest(`http://localhost:8080/user-by-name/${toUserName}`);
  const body = {
    // put in the request username from document here
    fromUserId: state.userId,
    groupId: groupAndAdmins.group.group_id,
    toUserId: toUserId[0].user_id,
    invitationStatus: 'pending',
  };
  const response = await database.sendPostRequest(url, body);
  await setGroupAndAdmins();
  return response;
};

const leaveGroup = async (userId, groupId, updateMessage) => {
  // update database - delete from groupMembership
  await database.sendBodiedDeleteRequest(`http://localhost:8080/leave-group/${groupId}`, { userId });

  // update message
  updateMessage('Membership deleted! You are no longer a member of the group');
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

const flagPost = async (changeState, postId) => {
  const response = await database.sendPutRequest(`http://localhost:8080/flag-post/${postId}`);
  changeState({ link: '/viewgroup' });

  return response;
};

const hidePost = async (changeState, postId) => {
  const response = await database.sendPutRequest(`http://localhost:8080/hide-post/${postId}`);
  changeState({ link: '/viewgroup' });

  return response;
};

const deletePost = async (changeState, postId) => {
  const response = await database.sendDeleteRequest(`http://localhost:8080/post/${postId}`);
  changeState({ link: '/viewgroup' });

  return response;
};

const flagReply = async (changeState, replyId) => {
  const response = await database.sendPutRequest(`http://localhost:8080/flag-reply/${replyId}`);
  changeState({ link: '/viewgroup' });

  return response;
};

const hideReply = async (changeState, replyId) => {
  const response = await database.sendPutRequest(`http://localhost:8080/hide-reply/${replyId}`);
  changeState({ link: '/viewgroup' });

  return response;
};

const deleteReply = async (changeState, replyId) => {
  const response = await database.sendDeleteRequest(`http://localhost:8080/reply/${replyId}`);
  changeState({ link: '/viewgroup' });

  return response;
};

const createReply = async (postId, postGroup, postingUser, caption, changeState) => {
  const newReply = {
    post_id: postId,
    post_group: postGroup,
    posting_user: postingUser,
    // eslint-disable-next-line
    caption: caption,
  };
  // eslint-disable-next-line no-console
  console.log(newReply);
  // eslint-disable-next-line
  const response = await database.sendPostRequest('http://localhost:8080/reply', newReply);

  changeState({ link: '/viewgroup' });
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
    + `<input className="reply-input" type="reply" id="input-${postId}" placeholder="reply to this post" />`
    // eslint-disable-next-line prefer-template
    + `<button type="reply-button" id="reply-button-${postId}"> Reply </button>`
    + '</div>'
    + '<div type="flag-and-delete">'
    + `<button type="flag" id="flag-post-${postId}"> Flag </button>`
    + `<button type="hide" id="hide-post-${postId}"> Hide </button>`
    + `<button type="delete" id="delete-post-${postId}"> Delete </button>`
    + '</div>'
    + '</div>';

    const postDiv = document.createElement('div');
    postDiv.innerHTML = postBlock;

    document.getElementById('posts-area').appendChild(postDiv);
    // eslint-disable-next-line no-console
    console.log(document.getElementById(postId));
  }
};

const parseReplies = (posts, replies) => {
  // iterate over all posts
  for (let i = 0; i < posts.length; i += 1) {
    const post = posts[i];
    const postId = post.post_id;

    // eslint-disable-next-line no-console
    console.log(post);

    // eslint-disable-next-line no-console
    console.log(postId);

    const element = document.getElementById(postId);
    // eslint-disable-next-line no-console
    console.log(element);

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
        + `<button type="flag" id="flag-reply-${replyId}"> Flag </button>`
        + `<button type="hide" id="hide-reply-${replyId}"> Hide </button>`
        + `<button type="delete" id="delete-reply-${replyId}"> Delete </button>`
        + '</div>'
        + '</div>';

        const replyDiv = document.createElement('div');
        replyDiv.innerHTML = replyBlock;
        element.appendChild(replyDiv);
      }
    }
  }
};

const parseOnclicks = (state, changeState, posts, replies) => {
  // eslint-disable-next-line no-console
  console.log('parsing on clicks');
  // iterate over all replies and those that belong to the current post will be appended
  for (let i = 0; i < posts.length; i += 1) {
    const post = posts[i];
    const postId = post.post_id;

    // eslint-disable-next-line no-console
    console.log(`reply-button-${postId}`);
    const replyButton = document.getElementById(`reply-button-${postId}`);
    // eslint-disable-next-line no-console
    console.log(`Reply Button: ${JSON.stringify(replyButton)}`);
    const flagPostButton = document.getElementById(`flag-post-${postId}`);
    const hidePostButton = document.getElementById(`hide-post-${postId}`);
    const deletePostButton = document.getElementById(`delete-post-${postId}`);

    // eslint-disable-next-line max-len
    replyButton.onclick = () => { createReply(postId, state.viewingGroup, state.userId, document.getElementById(`input-${postId}`).value, changeState); };
    flagPostButton.onclick = () => { flagPost(changeState, postId); };
    hidePostButton.onclick = () => { hidePost(changeState, postId); };
    deletePostButton.onclick = () => { deletePost(changeState, postId); };

    // eslint-disable-next-line no-console
    console.log(`Reply Button: ${JSON.stringify(replyButton)}`);
  }

  for (let j = 0; j < replies.length; j += 1) {
    const reply = replies[j];
    const replyId = reply.reply_id;

    const flagReplyButton = document.getElementById(`flag-reply-${replyId}`);
    const hideReplyButton = document.getElementById(`hide-reply-${replyId}`);
    const deleteReplyButton = document.getElementById(`delete-reply-${replyId}`);

    if (flagReplyButton) {
      flagReplyButton.onclick = () => { flagReply(changeState, replyId); };
      hideReplyButton.onclick = () => { hideReply(changeState, replyId); };
      deleteReplyButton.onclick = () => { deleteReply(changeState, replyId); };
    }
  }
};

module.exports = {
  getGroup,
  getAdmins,
  revokeAdmin,
  addAdmin,
  inviteNonAdmin,
  createPost,
  getPosts,
  parsePosts,
  createReply,
  getReplies,
  parseReplies,
  parseOnclicks,
  leaveGroup,
};
