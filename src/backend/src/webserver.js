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

webapp.listen(port, async () => {
  userDb = await userLib.connect();
  profileDb = await profileLib.connect();
  postDb = await postLib.connect();
  postCommentDb = await postCommentLib.connect();
  groupDb = await groupLib.connect();
  // eslint-disable-next-line no-console
  console.log('listening');
});

webapp.post('/registration', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('register a user');
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
    res.status(404).json({ err: err.message });
  }
});

webapp.post('/login', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('login a user');
  try {
    const name = req.body.user_name;
    const resultsUser = await userLib.getUsersWithName(userDb, name);
    if (resultsUser[0].length === 0) {
      res.status(404).json({ err: 'User does not exist' });
    } else if (req.body.user_password.includes(resultsUser[0][0].user_password)) {
      // TODO: increase the number of characters that
      // are able to be stored for a password for more accuracy
      const profile = await profileLib.getProfileById(profileDb, resultsUser[0][0].user_id);
      res.status(200).json({
        profile: profile[0][0],
      });
    } else {
      res.status(404).json({ err: 'Incorrect password' });
    }
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.get('/post/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('retrieve the post list of a user for their profile page');
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
  // eslint-disable-next-line no-console
  console.log('retrieve the comments on a post');
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
  // eslint-disable-next-line no-console
  console.log('control through webserver.js to post at /comment with a req of ', req.body);
  try {
    const commentObj = {
      post_id: req.body.post_id,
      user_id: req.body.user_id,
      comment_txt: req.body.comment_txt,
    };
    // eslint-disable-next-line no-console
    console.log('and now succesful on comment Obj of ', commentObj);
    const commentInsert = await postCommentLib.makeNewComment(postCommentDb, commentObj);
    res.status(200).json(commentInsert);
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
});

webapp.get('/profile/:id', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('retrieve profile information for supplied id.');
  try {
    const { id } = req.params;

    // assign to res.status
    const profileInfo = await profileLib.getProfileById(profileDb, id);
    // eslint-disable-next-line no-console
    console.log('retrieved (from model, still in controller) profile info: ', profileInfo);
    res.status(200).json(profileInfo);
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

    const resultsTopics = await groupLib.addTopics(groupDb, newTopics);
    return resultsTopics;
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
  return null;
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

webapp.use((req, res) => {
  // eslint-disable-next-line no-console
  console.log('testing to see if control gets to webapp.use');
  res.status(404);
});
