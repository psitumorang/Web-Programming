const mysql = require('mysql2/promise');

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

const addGroupMember = async (db, groupId, userId) => {
  const query = "INSERT INTO group_members VALUES (?, ?)";
  try {
    const [verifyRow] = await db.execute(query, [groupId, userId]);
    return verifyRow;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    throw err;
  }
}

const getMemberIds = async (db, groupId) => {
  const query = "SELECT member_id FROM group_members WHERE group_id = ?";
  try {
    const [membershipList] = await db.execute(query, [groupId]);
    return membershipList;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    throw err;
  }
};

module.exports = {
  connect,
  addGroupMember,
  getMemberIds,
};
