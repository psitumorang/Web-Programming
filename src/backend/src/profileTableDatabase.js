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
  const query = 'INSERT  INTO profile_lst (user_id , first_name, last_name, biography, profile_picture_url) VALUES(?, ?, ?, ?, ?)';
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
const getProfileById = async (db, id) => {
  try {
    const query = 'SELECT * FROM profile_lst WHERE user_id=?';
    const [rows] = await db.execute(query, [id]);
    // eslint-disable-next-line no-console
    console.log(`Users: ${JSON.stringify(rows)}`);
    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all users
const getProfiles = async (db) => {
  try {
    const query = 'SELECT * FROM profile_lst';
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
    const query = 'DELETE FROM profile_lst.user_id WHERE user_id=?';
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

// delete user by id.
// Building a second function because the other one's syntax seems wrong but I don't want to delete others' work
const deleteProfile2 = async (db, userId) => {
  try {
    const query = 'DELETE FROM profile_lst WHERE user_id=?';
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

// update a user's biography (not just the biography - not all profile attributes)
const updateProfile = async (db, userId, updateValue) => {
  try {
    const query = 'UPDATE profile_lst SET biography=? WHERE user_id=?';
    const params = [updateValue, userId];
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

// update a user's profile picture
const updateProfilePic = async (db, userId, updateValue) => {
  try {
    const query = 'UPDATE profile_lst SET profile_picture_url=? WHERE user_id=?';
    const params = [updateValue, userId];
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
  getProfileById,
  updateProfilePic,
  deleteProfile2,
};
