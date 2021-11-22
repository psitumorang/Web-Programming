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
        //console.log(" in postTableDB executed query with result of ", posts);
        return posts[0];
    } catch (err) {
        console.error("error trying to retrieve the user's posts");
        throw err;
    }
};

module.exports = {
    connect,
    getUserPosts,
}