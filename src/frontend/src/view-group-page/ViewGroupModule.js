import sendUploadPostRequest from '../UploadModule';

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

const addAdmin = async (groupAndAdmins, setGroupAndAdmins, changeState) => {
  const response = await database.sendPostRequest('http://localhost:8080/admins', {
    admin: {
      adminUser: document.getElementById('addAdmin').value,
      groupId: groupAndAdmins.group.group_id,
      isCreator: 0,
      groupName: groupAndAdmins.group.group_name,
    },
  });

  if (typeof response.err !== 'undefined') {
    changeState({ link: '/viewgroup/admin' });
    return null;
  }

  await setGroupAndAdmins();

  return response;
};

const inviteNonAdmin = async (groupAndAdmins, state, setGroupAndAdmins) => {
  const url = 'http://localhost:8080/invitations/';
  const toUserName = document.getElementById('addNonAdmin').value;

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

const uploadMediaPost = async (
  changeState,
  postGroup,
  postingUser,
  caption,
  selected,
  updateState,
  postingUsername,
) => {
  const file = document.getElementById('postContent').files[0];
  if (selected === 'image' && file.size > 10000000) {
    updateState({ link: '/viewgroup/post/error' });
    return null;
  } if ((selected === 'audio' || selected === 'video') && file.size > 100000000) {
    updateState({ link: '/viewgroup/post/error' });
    return null;
  }

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', ['yj7lgb8v']);
  sendUploadPostRequest(`https://api.cloudinary.com/v1_1/cis557-project-group-18/${selected === 'image' ? 'image' : 'video'}/upload`, data).then((mediaUrl) => {
    const newPost = {
      post_group: postGroup,
      posting_user: postingUser,
      caption,
      posting_username: postingUsername,
    };

    if (selected === 'image') {
      newPost.photourl = mediaUrl.data.url;
    } else if (selected === 'video') {
      newPost.videoUrl = mediaUrl.data.url;
    } else {
      newPost.audioUrl = mediaUrl.data.url;
    }

    return database.sendPostRequest(`http://localhost:8080/post/${selected}`, newPost).then(() => {
      changeState({ link: '/viewgroup' });
    });
  });
  return null;
};

const createPost = async (
  changeState,
  postGroup,
  postingUser,
  caption,
  selected,
  updateState,
  postingUsername,
) => {
  if (selected === 'audio') {
    return uploadMediaPost(
      changeState,
      postGroup,
      postingUser,
      caption,
      selected,
      updateState,
      postingUsername,
    );
  }
  if (selected === 'video') {
    return uploadMediaPost(
      changeState,
      postGroup,
      postingUser,
      caption,
      selected,
      updateState,
      postingUsername,
    );
  }
  if (selected === 'image') {
    return uploadMediaPost(
      changeState,
      postGroup,
      postingUser,
      caption,
      selected,
      updateState,
      postingUsername,
    );
  }

  const newPost = {
    post_group: postGroup,
    posting_user: postingUser,
    posting_username: postingUsername,
    caption,
  };

  // TODO check the length of post, if over 200 characters say too long
  if (caption.length > 200) {
    changeState({ link: '/viewgroup/post/error' });
    return null;
  }

  const response = await database.sendPostRequest('http://localhost:8080/post/text', newPost);
  return response;
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

const editReply = async (replyId, setEditComment) => {
  const response = await database.sendPostRequest(`http://localhost:8080/reply/${replyId}`, { caption: document.getElementById('edit-reply').value });
  setEditComment(-1);

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
    const postingUser = post.posting_username;
    // eslint-disable-next-line prefer-destructuring
    const caption = post.caption;
    let content = '';
    if (posts[i].photourl !== null) {
      content += `<div class="content image">
          <img src=${posts[i].photourl} class="image" alt="${posts[i].posting_username}'s image" />
        </div>`;
    } else if (posts[i].audioUrl !== null) {
      content += `<div class="content audio">
          <audio controls>
            <source src=${posts[i].audioUrl}>
          </audio>
        </div>`;
    } else if (posts[i].videoUrl !== null) {
      content += `<div class="content video">
          <video src=${posts[i].videoUrl} controls>
            Something went wrong!
          </video>
        </div>`;
    }

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
    + '<li id="content">'
    + content
    + '</li>'
    + '</ul>'
    + '</div>'
    + `<div class="comments" id="comments-${postId}">`
    + '<div class="create-comment">'
    + '<div class="reply">'
    + `<textarea class="reply-input" id="input-${postId}" placeholder="reply to this post"></textarea>`
    // eslint-disable-next-line prefer-template
    + `<button type="reply-button" id="reply-button-${postId}"> Reply </button>`
    + '</div>'
    + '<div type="flag-and-delete-post">'
    + '<p>Post options: </p>'
    + `<button type="flag" id="flag-post-${postId}"> Flag </button>`
    + `<button type="hide" id="hide-post-${postId}"> Hide </button>`
    + `<button type="delete" id="delete-post-${postId}"> Delete </button>`
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';

    const postDiv = document.createElement('div');
    postDiv.innerHTML = postBlock;

    document.getElementById('posts-area').appendChild(postDiv);
    // eslint-disable-next-line no-console
    console.log(document.getElementById(postId));
  }
};

const parseReplies = (posts, replies, editComment, setEditComment) => {
  // iterate over all posts
  for (let i = 0; i < posts.length; i += 1) {
    const post = posts[i];
    const postId = post.post_id;

    // eslint-disable-next-line no-console
    console.log(post);

    // eslint-disable-next-line no-console
    console.log(postId);

    const element = document.getElementById(`comments-${postId}`);
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
        let replyBlock = '<div class="reply-container">'
        + '<div class="reply-info">'
        + '<ul>'
        + '<li id="reply-id" >Reply Id: '
        + replyId
        + '</li>'
        + '<li id="replying-user">Replying User: '
        + replyUser
        + '</li>';

        if (editComment === -1) {
          replyBlock += `<li id="caption">Caption: ${caption}`
          + '</li>'
          + '</ul>'
          + '</div>'
          + '<div type="flag-and-delete">'
          + `<button type="flag" id="flag-reply-${replyId}"> Flag </button>`
          + `<button type="hide" id="hide-reply-${replyId}"> Hide </button>`
          + `<button type="edit" id="edit-reply-${replyId}"> Edit </button>`
          + `<button type="delete" id="delete-reply-${replyId}"> Delete </button>`
          + '</div>'
          + '</div>';
        } else {
          replyBlock += '</ul>'
            + '</div>'
            + `<textarea class="reply-input" id="edit-reply" placeholder="reply to this post">${caption}</textarea>`
            // eslint-disable-next-line prefer-template
            + '<button type="edit-reply-submit-button" id="edit-reply-submit-button"> Reply </button>'
            + '</div>'
            + '</div>';
        }

        const replyDiv = document.createElement('div');
        replyDiv.innerHTML = replyBlock;
        element.appendChild(replyDiv);
        if (document.getElementById('edit-reply-submit-button') !== null) {
          document.getElementById('edit-reply-submit-button').onclick = () => { editReply(replyId, setEditComment); };
        }
      }
    }
  }
};

const parseOnclicks = (state, changeState, posts, replies, setEditComment) => {
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
    const editReplyButton = document.getElementById(`edit-reply-${replyId}`);

    if (flagReplyButton) {
      flagReplyButton.onclick = () => { flagReply(changeState, replyId); };
      hideReplyButton.onclick = () => { hideReply(changeState, replyId); };
      deleteReplyButton.onclick = () => { deleteReply(changeState, replyId); };
      editReplyButton.onclick = () => { setEditComment(replyId); };
    }
  }
};

export {
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
