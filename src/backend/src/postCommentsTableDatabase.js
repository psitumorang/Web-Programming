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


module.exports = {
    connect,
    getPostComments,
}