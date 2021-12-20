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

// add a post to a group page
const addTextPost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst (post_id, post_group, posting_user, caption, posting_username) VALUES(?, ?, ?, ?, ?)';

  const params = [newPost.post_id, newPost.post_group, newPost.posting_user, newPost.caption, newPost.posting_username];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);
    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const addImagePost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst (post_id, post_group, posting_user, caption, photourl, posting_username) VALUES(?, ?, ?, ?, ?, ?)';

  const params = [newPost.post_id, newPost.post_group, newPost.posting_user, newPost.caption, newPost.photourl, newPost.posting_username];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);
    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const addAudioPost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst (post_id, post_group, posting_user, caption, audioUrl, posting_username) VALUES(?, ?, ?, ?, ?, ?)';
  console.log(newPost);
  const params = [newPost.post_id, newPost.post_group, newPost.posting_user, newPost.caption, newPost.audioUrl, newPost.posting_username];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);
    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const addVideoPost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst (post_id, post_group, posting_user, caption, videoUrl, posting_username) VALUES(?, ?, ?, ?, ?, ?)';

  const params = [newPost.post_id, newPost.post_group, newPost.posting_user, newPost.caption, newPost.videoUrl, newPost.posting_username];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created post with id: ${newPost.post_id}`);
    return newPost.post_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const flagPost = async (db, postId) => {
  const query = 'UPDATE post_lst SET is_flagged = 1 WHERE post_id = ?;';

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
};
