const mysql = require('mysql2/promise');

// Connect to our db on the cloud
const connect = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'database-1.cqgwv4rlupdn.us-east-2.rds.amazonaws.com',
      user: 'admin',
      password: 'staceyshapiro',
      database: 'db1',
    });
      // Connected to db
    // eslint-disable-next-line no-console
    console.log(`Connected to database: ${connection.connection.config.database}`);
    return connection;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    throw err;
  }
};

// get all posts (not the ones in a group) for a particular user id
const getUserPosts = async (db, id) => {
  try {
    // assign query using id as param
    const query = 'SELECT * FROM post_lst WHERE posting_user = ?';

    // execute query on db
    const posts = await db.execute(query, [id]);
    // console.log(" in postTableDB executed query with result of ", posts);
    return posts[0];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("error trying to retrieve the user's posts");
    throw err;
  }
};

const updateGroupPost = async (db, id) => {
  const updateGroup = 'UPDATE group_lst SET last_post=NOW(), post_number=IFNULL(post_number, 0)+1 WHERE group_id=?';
  try {
    await db.execute(updateGroup, [id]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  return null;
};

// add a post to a group page
const addTextPost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst '
  + '(post_id, post_group, posting_user, caption, posting_username) VALUES(?, ?, ?, ?, ?)';

  const postId = newPost.post_id;
  const group = newPost.post_group;
  const userId = newPost.posting_user;
  const { caption } = newPost;
  const username = newPost.posting_username;
  const params = [postId, group, userId, caption, username];
  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);

    await updateGroupPost(db, newPost.post_group);

    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const addImagePost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst '
  + '(post_id, post_group, posting_user, caption, photourl, posting_username) '
  + 'VALUES(?, ?, ?, ?, ?, ?)';

  const postId = newPost.post_id;
  const group = newPost.post_group;
  const userId = newPost.posting_user;
  const { caption } = newPost;
  const photoURL = newPost.photourl;
  const username = newPost.posting_username;
  const params = [postId, group, userId, caption, photoURL, username];
  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);

    await updateGroupPost(db, newPost.post_group);

    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const addAudioPost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst '
  + '(post_id, post_group, posting_user, caption, audioUrl, posting_username) '
  + 'VALUES(?, ?, ?, ?, ?, ?)';
  const postId = newPost.post_id;
  const group = newPost.post_group;
  const userId = newPost.posting_user;
  const { caption } = newPost;
  const audioURL = newPost.audioUrl;
  const username = newPost.posting_username;
  const params = [postId, group, userId, caption, audioURL, username];
  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);

    await updateGroupPost(db, newPost.post_group);

    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const addVideoPost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst '
  + '(post_id, post_group, posting_user, caption, videoUrl, posting_username) '
  + 'VALUES(?, ?, ?, ?, ?, ?)';
  const postId = newPost.post_id;
  const group = newPost.post_group;
  const userId = newPost.posting_user;
  const { caption } = newPost;
  const videoURL = newPost.videoUrl;
  const username = newPost.posting_username;
  const params = [postId, group, userId, caption, videoURL, username];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);

    await updateGroupPost(db, newPost.post_group);

    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const flagPost = async (db, postId, flagger) => {
  const query = 'UPDATE post_lst SET is_flagged = 1 WHERE post_id = ?;';

  const params = [postId];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Flagged post with id: ${postId} ${flagger}`);

    const addFlagger = 'INSERT INTO post_flags (post_id, flagging_user) VALUES(?, ?)';
    await db.execute(addFlagger, [postId, flagger]);

    return postId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const isFlagged = async (db, postId) => {
  const query = 'SELECT * from post_flags WHERE post_id=?';

  const params = [postId];

  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const removePostFlag = async (db, postId) => {
  const query = 'DELETE from post_flags WHERE post_id=?';

  const params = [postId];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Flagged post with id: ${postId}`);

    return postId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const hidePost = async (db, postId) => {
  const query = 'UPDATE post_lst SET is_hidden = 1 WHERE post_id = ?;';

  const params = [postId];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Hid post with id: ${postId}`);
    return postId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const deletePost = async (db, postId) => {
  const query = 'DELETE FROM post_lst WHERE post_id = ?;';

  const params = [postId];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Deleted post with id: ${postId}`);
    return postId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all groups
const getPosts = async (db, groupId) => {
  try {
    const query = 'SELECT * FROM post_lst WHERE post_group = ? AND is_hidden = 0 ORDER BY post_id DESC';

    const [rows] = await db.execute(query, [groupId]);
    // eslint-disable-next-line no-console
    console.log(`Posts: ${JSON.stringify(rows)}`);
    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all groups
const getPostById = async (db, postId) => {
  try {
    const query = 'SELECT * FROM post_lst WHERE post_id=?';

    const [rows] = await db.execute(query, [postId]);
    // eslint-disable-next-line no-console
    console.log(`Posts: ${JSON.stringify(rows)}`);
    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get next available id
const getNextId = async (db) => {
  try {
    const query = 'SELECT MAX(post_id) FROM post_lst';
    const [row] = await db.execute(query);
    return row[0]['MAX(post_id)'];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const getPostAnalyticsFacts = async (db) => {
  const analyticsFactsData = [];

  // total posts
  const totalPostsQuery = 'SELECT COUNT(*) as total_posts FROM post_lst';
  const [[totalPostsResult]] = await db.execute(totalPostsQuery);
  analyticsFactsData.push(['Total posts', totalPostsResult.total_posts]);

  // total hidden posts
  const hiddenPostsQuery = 'SELECT COUNT(*) as hidden_posts FROM post_lst WHERE is_hidden = 1';
  const [[hiddenPostsResult]] = await db.execute(hiddenPostsQuery);
  analyticsFactsData.push(['Hidden posts', hiddenPostsResult.hidden_posts]);

  // total distinct posters
  const numUniquePostersQuery = 'SELECT COUNT(DISTINCT posting_user) as unique_posters FROM post_lst';
  const [[numUniquePostersResult]] = await db.execute(numUniquePostersQuery);
  analyticsFactsData.push(['Unique posters', numUniquePostersResult.unique_posters]);

  // total comments (in groups)
  const totalCommentsQuery = 'SELECT COUNT(*) as total_comments FROM reply_lst';
  const [[totalCommentsResult]] = await db.execute(totalCommentsQuery);
  analyticsFactsData.push(['Total comments', totalCommentsResult.total_comments]);

  // return the Array of factname:value pairs
  return analyticsFactsData;
};

module.exports = {
  connect,
  getUserPosts,
  addTextPost,
  addImagePost,
  addAudioPost,
  addVideoPost,
  flagPost,
  hidePost,
  deletePost,
  getPosts,
  getNextId,
  getPostAnalyticsFacts,
  removePostFlag,
  getPostById,
  isFlagged,
};
