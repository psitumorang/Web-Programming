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

// add an admin for a group
// TODO edit
const addAdminForGroup = async (db, groupId, adminId, isCreator, name) => {
  const query = 'INSERT INTO admin_lst (group_id, admin_id, is_creator, user_name) VALUES(?, ?, ?, ?)';

  const params = [groupId, adminId, isCreator, name];
  try {
    const [row] = await db.execute(query, params);

    // eslint-disable-next-line no-console
    console.log(`Created admin: ${row}`);
    return row;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: admin already exists');
  }
  return null;
};

// get admins for group
const getAdmins = async (db, groupId) => {
  const query = 'SELECT * FROM admin_lst WHERE group_id=?';

  const params = [groupId];

  try {
    const [rows] = await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Got admins for group: ${rows}`);
    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all admins ordered by group id
const getAllAdmins = async (db) => {
  const query = 'SELECT * FROM admin_lst ORDER BY group_id DESC';

  try {
    const [rows] = await db.execute(query);

    // format the results into obj of group_id admins objects
    const ret = {};
    const completed = [];
    rows.forEach((row) => {
      if (completed.includes(row.group_id)) ret[row.group_id].push(row.user_name);
      else {
        ret[row.group_id] = [row.user_name];
        completed.push(row.group_id);
      }
    });

    // eslint-disable-next-line no-console
    console.log(`Got admins for group: ${ret}`);
    return ret;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: failed to retrieve all admins');
  }
  return null;
};

// get all groups administered by a particular user
const getAdministeredGroups = async (db, userId) => {
  const query = 'SELECT group_id FROM admin_lst WHERE admin_id = ?';
  try {
    const [result] = await db.execute(query, [userId]);
    return result;
  } catch (err) {
    return err;
  }
};

// remove an admin
const revokeAdmin = async (db, groupId, adminUser) => {
  try {
    const verify = 'SELECT * FROM admin_lst WHERE group_id=? AND user_name=?';

    const query = 'DELETE FROM admin_lst WHERE group_id=? AND user_name=?';

    const params = [groupId, adminUser];

    const [row] = await db.execute(verify, params);
    if (row[0].is_creator === 1) {
      return { err: { message: 'admin is creator of group, cannot be revoked' } };
    }
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Removed ${row}`);
    return row;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: groupId or adminId invalid');
  }
  return null;
};

const deleteAdmins = async (db, userId) => {
  try {
    const query = 'DELETE FROM admin_lst WHERE admin_id = ?';
    const [result] = await db.execute(query, [userId]);
    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: from db execute step for deleteAdmins');
    return 0;
  }
};

module.exports = {
  connect,
  addAdminForGroup,
  getAdmins,
  revokeAdmin,
  getAllAdmins,
  getAdministeredGroups,
  deleteAdmins,
};
