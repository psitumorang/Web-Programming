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
const addPost = async (db, newPost) => {
  const query = 'INSERT INTO post_lst (post_id, post_group, posting_user, caption) VALUES(?, ?, ?, ?)';

  const params = [newPost.post_id, newPost.post_group, newPost.posting_user, newPost.caption];

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

// get all groups
const getPosts = async (db, groupId) => {
  try {
    const query = 'SELECT * FROM post_lst WHERE post_group = ?';
    
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
  addPost,
  getPosts,
  getNextId,
};
