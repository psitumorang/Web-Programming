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

// add a user
const addUser = async (db, newUser) => {
  const query = 'INSERT INTO user_lst (user_id , user_name, user_password, registration_date) VALUES(?, ?, ?, STR_TO_DATE(?, "%m-%d-%Y"))';
    
  const verifyQuery = 'SELECT COUNT(*) FROM user_lst WHERE user_name=?';
    
  const date = new Date();
  const params = [newUser.user_id, newUser.user_name,
    newUser.user_password, `${date.getUTCMonth() + 1}-${date.getUTCDate()}-${date.getUTCFullYear()}`];
  try {
    const [verifyRow] = await db.execute(verifyQuery, [newUser.user_name]);
    console.log(verifyRow[0], verifyRow[0]['COUNT(*)'], typeof verifyRow[0]['COUNT(*)']);
    if (verifyRow[0]['COUNT(*)'] != 0) {
        //Another user has the same username!
        console.log('one of the same');
        return null;
    }
        
    const [row] = await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created user with id: ${newUser.user_id}`);
    return newUser.user_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all users
const getUsers = async (db) => {
  try {
    const query = 'SELECT * FROM user_lst';
    const [rows] = await db.execute(query);
    // eslint-disable-next-line no-console
    console.log(`Users: ${JSON.stringify(rows)}`);
    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all users with same username
const getUsersWithName = async (db, name) => {
  try {
    const query = 'SELECT * FROM user_lst WHERE user_list.user_name=?';
    const [rows] = await db.execute(query, [name]);
    // eslint-disable-next-line no-console
    console.log(`Users: ${JSON.stringify(rows)}`);
    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// delete user by name
const deleteUser = async (db, name) => {
  try {
    const query = 'DELETE FROM user_lst.user_name WHERE user_name=?';
    const [row] = await db.execute(query, [name]);
    // eslint-disable-next-line no-console
    console.log(`Deleted ${JSON.stringify(row.affectedRows)} users(s)`);
    return [row];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// update a user
const updateUser = async (db, userId, paramToUpdate, updateValue) => {
  try {
    const query = 'UPDATE user_lst SET ?=? WHERE user_id=?';
    const params = [paramToUpdate, updateValue, userId];
    const [row] = await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Updated ${JSON.stringify(row.affectedRows)} player`);
    return [row];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get next available id
const getNextId = async (db) => {
  try {
    const query = 'SELECT MAX(user_id) FROM user_lst';
    const [row] = await db.execute(query);
    return row[0]['MAX(user_id)'];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

module.exports = {
  connect,
  addUser,
  getUsers,
  getUsersWithName,
  deleteUser,
  updateUser,
  getNextId,
};
