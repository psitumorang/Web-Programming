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
const addProfile = async (db, newProfile) => {
  const query = 'INSERT  INTO db1.profile_lst (user_id , first_name, last_name, biography, profile_picture_url) VALUES(?, ?, ?, ?, ?)';
  const params = [newProfile.user_id, newProfile.first_name,
    newProfile.last_name, newProfile.biography, newProfile.profile_picture_url];
  try {
    const [row] = await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created user with id: ${newProfile.user_id}`);
    return [row];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all users
const getProfiles = async (db) => {
  try {
    const query = 'SELECT * FROM db1.profile_lst';
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

// delete user by id
const deleteProfile = async (db, userId) => {
  try {
    const query = 'DELETE FROM db1.profile_lst.user_id WHERE user_id=?';
    const [row] = await db.execute(query, [userId]);
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
const updateProfile = async (db, userId, paramToUpdate, updateValue) => {
  try {
    const query = 'UPDATE db1.profile_lst SET ?=? WHERE user_id=?';
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

module.exports = {
  connect,
  addProfile,
  getProfiles,
  deleteProfile,
  updateProfile,
};
