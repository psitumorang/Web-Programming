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

const getPostComments = async (db, id) => {
  try {
    // assign query using id as param
    const query = 'SELECT * FROM post_comments WHERE post_id = ?';

    // execute query on db
    const postComments = await db.execute(query, [id]);
    console.log(" in postCommentsTableDB executed query with result of ", postComments);
    return postComments[0];
  } catch (err) {
    console.error("error trying to retrieve the user's posts");
    throw err;
  }
};

const makeNewComment = async (db, comment) => {
  console.log('in postcommentsTableDatabase with comment of ', comment);
  try {
    // get the comment_id to insert (e.g. max in table then increment)
    const maxQuery = 'SELECT MAX(comment_id) FROM post_comments';
    const maxID = await db.execute(maxQuery);
    const newCommentID = maxID + 1;
    
    // assign query using comment in body
    const query = 'INSERT INTO post_comments VALUES (?, ?, ?, ?)';
    const query_params = [newCommentID, comment.post_id, comment.user_id, comment_txt, ];
    const insertion = await db.execute(query, query_params);
    return insertion;

  } catch (err) {
    console.error('error trying to make new comment!');
    throw err;
  }
}


module.exports = {
    connect,
    getPostComments,
    makeNewComment,
}