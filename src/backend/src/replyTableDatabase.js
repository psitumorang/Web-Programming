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

// add a post to a group page
const addReply = async (db, newReply) => {
  const query = 'INSERT INTO reply_lst (reply_id, post_id, post_group, posting_user, caption) VALUES(?, ?, ?, ?, ?)';

  const params = [newReply.reply_id, newReply.post_id, newReply.post_group, newReply.posting_user, newReply.caption];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created reply with id: ${newReply.reply_id}`);
    return newReply.reply_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const flagReply = async (db, replyId) => {
  const query = 'UPDATE reply_lst SET is_flagged = 1 WHERE reply_id = ?;';

  const params = [replyId];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Flagged reply with id: ${replyId}`);
    return replyId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const hideReply = async (db, replyId) => {
  const query = 'UPDATE reply_lst SET is_hidden = 1 WHERE reply_id = ?;';

  const params = [replyId];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Hid reply with id: ${replyId}`);
    return replyId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add a post to a group page
const deleteReply = async (db, replyId) => {
  const query = 'DELETE FROM reply_lst WHERE reply_id = ?;';

  const params = [replyId];

  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Deleted reply with id: ${replyId}`);
    return replyId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all replies
const getReplies = async (db, groupId) => {
  try {
    const query = 'SELECT * FROM reply_lst WHERE post_group = ? AND is_hidden = 0 ORDER BY reply_id DESC';
    
    const [rows] = await db.execute(query, [groupId]);
    // eslint-disable-next-line no-console
    console.log(`Replies: ${JSON.stringify(rows)}`);
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
    const query = 'SELECT MAX(reply_id) FROM reply_lst';
    const [row] = await db.execute(query);
    return row[0]['MAX(reply_id)'];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};


module.exports = {
  connect,
  addReply,
  flagReply,
  hideReply,
  deleteReply,
  getReplies,
  getNextId,
};
