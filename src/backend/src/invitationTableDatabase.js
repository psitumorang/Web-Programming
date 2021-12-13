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

// add an invitation
/** NEED TO UPDATE THIS TO INCLUDE INVITER AND GROUP params const addInvitation = async (db, id, invitation) => {
  const query = 'INSERT INTO invitations (user_id, is_read, msg, date) VALUES(?, ?, ?, NOW())';

  const params = [id, notification.isRead, notification.msg];
  try {
    const [rows] = await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created notif with id: ${notification.id}`, rows);
    return notification;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
}; */

// gets all invitations for user
const getPendingInvitations = async (db, id) => {
  const query = 'SELECT * FROM invitations WHERE to_user_id=? AND invitation_status=\'pending\' ORDER BY invitation_status DESC';

  try {
    const [rows] = await db.execute(query, [id]);

    // change the rows we just fetched to be read now!

    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// update an invitation to accept or decline it for user
const updateInvitationStatus = async (db, invitationId, newStatus) => {
  const query = 'UPDATE invitations SET invitation_status=? WHERE invitation_id=?';

  try {
    console.log('about to execute updateInvitation status sql with newStatus of ', newStatus, ' and invitationId of ', invitationId);
    const [rows] = await db.execute(query, [newStatus, invitationId]);

    // change the rows we just fetched to be read now!

    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get accepted invitations for review by admin
const getInvitationsToReview = async (db, adminId) => {
  query = ' \
  SELECT invitation_id, admin_id, group_lst.group_id, group_lst.group_name, to_user_id, from_user_id, user_lst.user_name \
  FROM invitations \
  LEFT JOIN group_lst on invitations.group_id = group_lst.group_id \
  LEFT JOIN user_lst on user_lst.user_id = invitations.to_user_id \
  LEFT JOIN admin_lst on invitations.group_id = admin_lst.group_id \
  WHERE admin_id = ? AND invitation_status = \'accepted\'';
  try {
    const [invitations] = await db.execute(query, [adminId]);
    return invitations;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const addInvitation = async (db, invitationObject) => {
  // get next row increment
  const [maxInvitationId] = await db.execute('SELECT MAX(invitation_id) as max_id FROM invitations', []);
  console.log('in addinvitation in invitationtable DB, got back maxinvitation id of: ', maxInvitationId);
  const nextInvitationId = maxInvitationId[0].max_id + 1;
  
  const query = 'INSERT INTO invitations (invitation_id, to_user_id, from_user_id, invitation_status, group_id) VALUES (?, ?, ?, ?, ?)';
  const params = [
    nextInvitationId,
    invitationObject.toUserId,
    invitationObject.fromUserId,
    invitationObject.invitationStatus,
    invitationObject.groupId
  ]
  console.log('in invitationstabledb, with params ', params);
  try {
    const [rowsAffected] = await db.execute(query, params);
    return rowsAffected;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

module.exports = {
  connect,
  getPendingInvitations,
  updateInvitationStatus,
  addInvitation,
  getInvitationsToReview,
};
