const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const webapp = express();

webapp.use(cors());

const userLib = require('./userTableDatabase');
const profileLib = require('./profileTableDatabase');
const postLib = require('./postTableDatabase');
const postCommentLib = require('./postCommentsTableDatabase');
const groupLib = require('./groupTableDatabase');
const notifLib = require('./notificationTableDatabase');
const adminLib = require('./adminTableDatabase');
const replyLib = require('./replyTableDatabase');
const inviteLib = require('./invitationTableDatabase');
const groupMemberLib = require('./groupMemberTableDatabase');

const port = 8080;

webapp.use(bodyParser.urlencoded());
webapp.use(bodyParser.json());

webapp.use(express.urlencoded({
  extended: true,
}));

let userDb;
let profileDb;
let postDb;
let postCommentDb;
let groupDb;
let notifDb;
let adminDb;
let replyDb;
let inviteDb;
let groupMemberDb;

webapp.listen(port, async () => {
  userDb = await userLib.connect();
  profileDb = await profileLib.connect();
  postDb = await postLib.connect();
  postCommentDb = await postCommentLib.connect();
  groupDb = await groupLib.connect();
  notifDb = await notifLib.connect();
  adminDb = await adminLib.connect();
  replyDb = await replyLib.connect();
  inviteDb = await inviteLib.connect();
  groupMemberDb = await groupMemberLib.connect();
  // eslint-disable-next-line no-console
  console.log('listening');
});

webapp.post('/registration', async (req, res) => {
  try {
    const nextId = await userLib.getNextId(userDb);
    const newUser = {
      user_id: nextId + 1,
      user_name: req.body.user_name,
      user_password: req.body.user_password,
    };
    const newProfile = {
      user_id: nextId + 1,
      first_name: '',
      last_name: '',
      biography: '',
      profile_picture_url: '',
    };
    const resultsUser = await userLib.addUser(userDb, newUser);
    if (resultsUser === null) {
      res.status(404).json({ err: 'username already taken' });
    } else {
      profileLib.addProfile(profileDb, newProfile);

      res.status(201).json({
        user: newUser,
        profile: newProfile,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('testing to see if control gets to catch in webserver.js for rego post');
    // eslint-disable-next-line no-console
    console.log('testing to see if control gets to catch in webserver.js for rego post');
    res.status(404).json({ err: err.message });
  }
});

webapp.post('/login', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('login a user');
  try {
    const name = req.body.user_name;
    const resultsUser = await userLib.getUsersWithName(userDb, name);
    if (resultsUser.length === 0) {
      res.status(404).json({ err: 'User does not exist' });
    } else if (req.body.user_password.includes(resultsUser[0].user_password)) {
      // TODO: increase the number of characters that
      // are able to be stored for a password for more accuracy
      const profile = await profileLib.getProfileById(profileDb, resultsUser[0].user_id);

      console.log(`profile is: ${profile.user_id}`)
      res.status(200).json({
        profile: profile[0],
      });
    } else {
      res.status(404).json({ err: 'Incorrect password' });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // assign to res.status

    const postList = await postLib.getUserPosts(postDb, id);
    // eslint-disable-next-line no-console
    console.log('returning postList from webserver of: ', postList);
    res.status(200).json(postList);
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.get('/comment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // assign to res.status
    const commentList = await postCommentLib.getPostComments(postCommentDb, id);
    res.status(200).json(commentList);
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.post('/comment', async (req, res) => {
  try {
    const commentObj = {
      post_id: req.body.post_id,
      user_id: req.body.user_id,
      comment_txt: req.body.comment_txt,
    };
    const commentInsert = await postCommentLib.makeNewComment(postCommentDb, commentObj);
    res.status(200).json(commentInsert);
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // assign to res.status
    const profileInfo = await profileLib.getProfileById(profileDb, id);
    res.status(200).json(profileInfo);
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.delete('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('in delete profile id with id of ', id);
    // assign to res.status
    const numDeletedProfiles = await profileLib.deleteProfile2(profileDb, id);
    res.status(200).json(numDeletedProfiles);
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.post('/groups', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('create a group');
  try {
    const nextId = await groupLib.getNextId(groupDb);
    const newGroup = {
      group_id: nextId + 1,
      group_name: req.body.group_name,
      group_creator: req.body.group_creator,
      group_description: req.body.group_description,
      is_public: req.body.is_public,
    };

    const newTopics = {
      group_id: nextId + 1,
      topic_1: req.body.topic_1,
      topic_2: req.body.topic_2,
      topic_3: req.body.topic_3,
    };

    const resultsGroup = await groupLib.addGroup(groupDb, newGroup);
    if (resultsGroup === null) {
      res.status(404).json({ err: 'groupname already taken' });
    } else {
      res.status(201).json({
        group: newGroup,
      });
    }

    const userId = await userLib.getUsersWithName(userDb, newGroup.group_creator);
    await adminLib.addAdminForGroup(
      adminDb,
      newGroup.group_id,
      userId[0].user_id,
      1,
      newGroup.group_creator,
    );
    await notifLib.addNotification(
      notifDb,
      userId[0].user_id,
      { notification: { isRead: false, msg: `Congratulations! You are now the creator and admin of the group ${newGroup.group_name}` } },
    );

    const resultsTopics = await groupLib.addTopics(groupDb, newTopics);
    return resultsTopics;
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.get('/groups/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get one group groups');

  try {
    const groups = await groupLib.getGroupById(groupDb, req.params.id);
    if (groups === null) {
      res.status(404).json({ err: 'no groups found' });
    } else {
      res.status(200).json(groups);
    }
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.get('/groups', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get groups');

  try {
    const groups = await groupLib.getGroups(groupDb);
    if (groups === null) {
      res.status(404).json({ err: 'no groups found' });
    } else {
      res.status(200).json({ result: groups });
    }
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.get('/user/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('retrieve user information for supplied id, with id of: ', req.params.id);
  try {
    const { id } = req.params;
    const userInfo = await userLib.getUserById(userDb, id);
    // eslint-disable-next-line no-console
    console.log('retrieved user info from model, current at webserver/user/id/get, value of: ', userInfo);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(404).json('error! at webserver/user/id/get');
  }
});

webapp.get('/user-by-name/:name', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('in webserver, retrieve user information for supplied name of: ', req.params.name);
  try {
    const { name } = req.params;
    const userInfo = await userLib.getUsersWithName(userDb, name);
    // eslint-disable-next-line no-console
    console.log('retrieved user info from model, current at webserver/user/name/get, value of: ', userInfo);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(404).json('error! at webserver/user/name/get');
  }
});

webapp.put('/user/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('make it to webserver/webapp.put/user/id with params: ', req.params);
  console.log('make it to webserver/webapp.put/user/id with body: ', req.body);
  try {
    const { id } = req.params;
    const userPassword = req.body.user_password;
    // get password from body not params!
    const userInfo = await userLib.updateUser(userDb, id, 'user_password', userPassword);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(404).json('error! at webserver/user/id/put');
  }
});

webapp.delete('/user/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('make it to webserver/user/id/delete with ', req.params);
  try {
    const { id } = req.params;
    const deletedRows = await userLib.deleteUser(userDb, id);
    res.status(200).json(deletedRows);
  } catch (err) {
    res.status(404).json('error! at webserver/user/id/delete');
  }
});

// this one only updates the bio. I originally tried to make it a dynamic variable update, but had issues.
webapp.put('/profile/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('make it to webserver/webapp.put/profile/id with params: ', req.params);
  try {
    const { id } = req.params;
    console.log('biography to be set: ', req.body);
    const { biography } = req.body;
    // get password from body not params!
    const userInfo = await profileLib.updateProfile(profileDb, id, biography);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(404).json('error! at webserver/profile/id/put');
  }
});

// this updates the profile pic
webapp.put('/profile-pic/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('make it to webserver/webapp.put/profile-pic/id with params: ', req.params);
  try {
    const { id } = req.params;
    console.log('profilePictureURL to be set: ', req.body);
    const { profilePictureURL } = req.body;
    // get password from body not params!
    const userInfo = await profileLib.updateProfilePic(profileDb, id, profilePictureURL);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(404).json('error! at webserver/profile-pic/id/put');
  }
});

webapp.get('/notifications/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get notifications');
  const { id } = req.params;
  try {
    const notifications = await notifLib.getNotifications(notifDb, id);

    // eslint-disable-next-line no-console
    console.log('got notifications: ', notifications);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(400).json({ err: `error is ${err.message}` });
  }
});

webapp.post('/notifications/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('POST notifications, ', req.params, req.body.notification);
  const { id } = req.params;
  try {
    const notifications = await notifLib.addNotification(notifDb, id, req.body.notification);

    // eslint-disable-next-line no-console
    console.log('got notifications: ', notifications);
    res.status(201);
  } catch (err) {
    res.status(400).json({ err: `error is ${err.message}` });
  }
});

// get all pending invitations (for a person I think)
webapp.get('/invitations/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get invitations');
  const { id } = req.params;
  try {
    const invitations = await inviteLib.getPendingInvitations(inviteDb, id);

    // eslint-disable-next-line no-console
    // console.log('got invitations: ', invitations);
    res.status(200).json(invitations);
  } catch (err) {
    console.log('error at webserver.js. in catch, with err of ', err);
    res.status(400).json({ err: `error is ${err.message}` });
  }
});

// get all pending OR accepted invitations for a group
webapp.get('/invitations-open/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('get open invitations');
    const { id } = req.params;
    try {
      const openInvites = await inviteLib.getOpenInvitesByGroupId(inviteDb, id);
      res.status(200).json(openInvites);
    } catch (err) {
      console.log('error at webserver.js/invitations-open. in catch, with err of ', err);
      res.status(400).json({ err: `error is ${err.message}` });
    }
});

webapp.post('/invitations/', async (req, res) => {
  

  // const { id } = req.params;
  // eslint-disable-next-line no-console
  // console.log('post invitations with params of: ', req.params);
  const { fromUserId, toUserId, groupId, invitationStatus } = req.body;
  const invitationObject = {
    fromUserId: fromUserId,
    toUserId: toUserId,
    groupId: groupId,
    invitationStatus: invitationStatus,
  };
  try {
    const invitation = await inviteLib.addInvitation(inviteDb, invitationObject);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error! ', err);
    res.status(400).json({ err: `error is ${err.message}` });
  }
});

webapp.put('/invitations/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('put invitations');
  const { id } = req.params;
  const { newStatus } = req.body;
  try {
    console.log('before updateCount execution, in webserver, req.params is: ', req.params);
    const updateCount = await inviteLib.updateInvitationStatus(inviteDb, id, newStatus);

    // eslint-disable-next-line no-console
    console.log('updated ', updateCount, 'invitations.');
    res.status(200).json(updateCount);
  } catch (err) {
    console.log('error at webserver.js. in catch, with err of ', err);
    res.status(400).json({ err: `error is ${err.message}` });
  }
});

webapp.delete('/invitations/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('deleting invitations');
    const { id } = req.params;
    try {
      console.log('before executing server module for delete Invitations, id is ', id, 'and req params is ', req.params);
      const numDeletedInvites = await inviteLib.deletePendingInvites(inviteDb, id);
      res.status(200).json(numDeletedInvites);
    } catch (err) {
      console.log('error at webserver.js delete invitations. in catch, with err of ', err);
      res.status(400).json({ err: `error is ${err.message}` });
    }
});

webapp.post('/membership/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('post group membership to accept invitations, webserver, with req.body of:', req.body);

    const { id } = req.params;
    const userId = req.body.id;
    try {
      const postReturn = await groupMemberLib.addGroupMember(groupMemberDb, id, userId);
      res.status(200).json(postReturn);
    } catch (err) {
      res.status(400).json({ err: `error is ${err.message}` });
    }
});

webapp.get('/membership/:id', async (req, res) => {
  try {
    const membershipList = await groupMemberLib.getMemberIds(groupMemberDb, req.params.id);
    res.status(200).json(membershipList);
  } catch (err) {
    res.status(400).json({ err: `error is ${err.message}` });
  }
})

// deletes ALL the membership associated with a user id
webapp.delete('/membership/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`deleting memberships with userid ${JSON.stringify(req.params.id)}`);
  try {
    const result = await groupMemberLib.deleteUserMemberships(groupMemberDb, req.params.id);
    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

// deletes the membership of one group-user pair. Takes group id in param, userid in body
webapp.delete('/leave-group/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('deleting single membership of userid with req body of ', req.body);
  const groupId = req.params.id;
  const { userId } = req.body;
  try {
    const result = await groupMemberLib.deleteSingleMembership(groupMemberDb, groupId, userId);
    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
})

webapp.post('/admins', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('POST admins, ', req.body.admin);
  try {
    const userId = await userLib.getUsersWithName(userDb, req.body.admin.adminUser);

    const admin = await adminLib.addAdminForGroup(
      adminDb,
      req.body.admin.groupId,
      userId[0].user_id,
      req.body.admin.isCreator,
      req.body.admin.adminUser,
    );

    await notifLib.addNotification(notifDb, userId[0].user_id, { notification: { isRead: 0, msg: `Congratulations! You were promoted to admin of group: ${req.body.admin.groupName}` } });
    // eslint-disable-next-line no-console
    console.log('got admin: ', admin);
    res.status(201).json(admin);
  } catch (err) {
    res.status(400).json({ err: `error is ${err.message}` });
  }
});

// gets all admins for a particular group (e.g. id here is group, not user)
webapp.get('/admins/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get admins');
  try {
    const admin = await adminLib.getAdmins(adminDb, req.params.id);

    // eslint-disable-next-line no-console
    console.log('got admins: ', admin);
    res.status(200).json(admin);
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.delete('/admins/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('delete administrator records for deactivated user');
  try {
    const admin = await adminLib.deleteAdmins(adminDb, req.params.id);

    res.status(200).json(admin);
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
})

webapp.get('/admins', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get all admins');
  try {
    const admins = await adminLib.getAllAdmins(adminDb);

    // eslint-disable-next-line no-console
    console.log('got all admins: ', admins);
    res.status(200).json(admins);
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.get('/administered-groups/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get all groups that the given userId administers');
  try {
    const administeredGroups = await adminLib.getAdministeredGroups(req.params.id);
    res.status(200).json(administeredGroups);
  } catch(err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.delete('/admins', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('delete admin');
  try {
    const admin = await adminLib.revokeAdmin(adminDb, req.query.groupId, req.query.adminUser);

    // eslint-disable-next-line no-console
    console.log('removed admin: ', admin);

    if (typeof admin.err !== 'undefined') {
      res.status(400).json(admin.err);
      return;
    }

    await notifLib.addNotification(notifDb, admin[0].admin_id, { notification: { isRead: 0, msg: `You were removed as admin from ${req.query.groupName}. Too bad so sad :(` } });

    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({ err: `error is ${err.message}` });
  }
});

webapp.post('/post', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('create a group post');
  try {
    const nextId = await postLib.getNextId(postDb);
    const newPost = {
      post_id: nextId + 1,
      post_group: req.body.post_group,
      posting_user: req.body.posting_user,
      caption: req.body.caption,
    };

    console.log(`new post ${newPost.post_id}, ${newPost.post_group} , ${newPost.posting_user} , ${newPost.caption} `)

    const result = await postLib.addPost(postDb, newPost);
    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        post: newPost,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.put('/flag-post/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`flag a group post with id ${JSON.stringify(req.params.id)}`);
  try {
    const result = await postLib.flagPost(postDb, req.params.id);

    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.put('/hide-post/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`hide a group post with id ${JSON.stringify(req.params.id)}`);
  try {
    const result = await postLib.hidePost(postDb, req.params.id);

    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.delete('/post/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`deleting a group post with id ${JSON.stringify(req.params.id)}`);
  try {
    const result = await postLib.deletePost(postDb, req.params.id);

    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.get('/posts/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get posts');

  try {
    const posts = await postLib.getPosts(postDb, req.params.id);
    if (posts === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(200).json({ result: posts });
    }
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.post('/reply', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('create reply');
  try {
    const nextId = await replyLib.getNextId(replyDb);
    const newReply = {
      reply_id: nextId + 1,
      post_id: req.body.post_id,
      post_group: req.body.post_group,
      posting_user: req.body.posting_user,
      caption: req.body.caption,
    };

    console.log(`new reply ${newReply.reply_id}, ${newReply.post_id} , ${newReply.posting_user} , ${newReply.caption} `)

    const result = await replyLib.addReply(replyDb, newReply);
    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        reply: newReply,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.get('/replies/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get replies');

  try {
    const replies = await replyLib.getReplies(replyDb, req.params.id);
    if (replies === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(200).json({ result: replies });
    }
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.get('/invitations-review/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get invitations to review - in webserver.js');

  try {
    const invitations = await inviteLib.getInvitationsToReview(inviteDb, req.params.id);
    res.status(200).json(invitations);
  } catch (err) {
    res.status(404).json({ err: `error is ${err.message}` });
  }
});

webapp.put('/flag-reply/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`flag a reply with id ${JSON.stringify(req.params.id)}`);
  try {
    const result = await replyLib.flagReply(replyDb, req.params.id);

    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.put('/hide-reply/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`hide a reply with id ${JSON.stringify(req.params.id)}`);
  try {
    const result = await replyLib.hideReply(replyDb, req.params.id);

    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.delete('/reply/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`deleting a reply with id ${JSON.stringify(req.params.id)}`);
  try {
    const result = await replyLib.deleteReply(replyDb, req.params.id);

    if (result === null) {
      res.status(404).json({ err: err.message });
    } else {
      res.status(201).json({
        result: result,
      });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
});

webapp.use((req, res) => {
  // eslint-disable-next-line no-console
  console.log('testing to see if control gets to webapp.use, req is: ', req);
  res.status(404);
});
