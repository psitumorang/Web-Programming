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

// get admins for group
const convoExists = async (db, user1, user2) => {
  const query = 'SELECT * FROM convo_lst WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)';

  const params = [user1, user2, user2, user1];
  try {
    const [rows] = await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Got convos: ${rows}`);
    return rows.length != 0;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add text message from a user to another user
const addConvo = async (db, user1, user2, user1Name, user2Name) => {
  const query = 'INSERT INTO convo_lst (user1, user2, user1Name, user2Name) VALUES(?, ?, ?, ?)';
  const params = [user1, user2, user1Name, user2Name];

  try {
    const [row] = await db.execute(query, params);

    // eslint-disable-next-line no-console
    console.log(`Created convo: ${row}`);
    return row.insertId;
  } catch (err) {
    console.log(err);
    // eslint-disable-next-line no-console
    console.log('error: convo already exists');
  }
  return null;
};

// add text message from a user to another user
const getConvoId = async (db, user1, user2) => {
  const query = 'SELECT * FROM convo_lst WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)';
  const params = [user1, user2, user2, user1];

  try {
    const [row] = await db.execute(query, params);

    // eslint-disable-next-line no-console
    console.log(`Got convo: ${row}`);
    return row[0].convoId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: convo already exists');
  }
  return null;
};

// get admins for group
const getConvosForUser = async (db, id) => {
  const query = 'SELECT * FROM convo_lst WHERE user1=? OR user2=?';

  const params = [id, id];

  try {
    const [rows] = await db.execute(query, params);
    console.log(rows);
    // eslint-disable-next-line no-console
    console.log(`Got convos: ${rows}`);
    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

module.exports = {
  connect,
  addConvo,
  getConvoId,
  getConvosForUser,
  convoExists,
};
