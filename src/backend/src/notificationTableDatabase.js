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

// add a notification
const addNotification = async (db, id, notification) => {
  const query = 'INSERT INTO notification_lst (notif_id , user_id, is_read, notif_msg, notif_date) VALUES(?, ?, ?, ?, STR_TO_DATE(?, "%m-%d-%Y"))';

  const date = new Date();
  const params = [notification.id, notification.userId,
    notification.isRead, notification.msg, `${date.getUTCMonth() + 1}-${date.getUTCDate()}-${date.getUTCFullYear()}`];
  try {
    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created notif with id: ${notification.id}`);
    return notification;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// gets all notifications for user
const getNotifications = async (db, id) => {
  const query = 'SELECT * FROM notification_lst WHERE user_id=?';

  try {
    const [rows] = await db.execute(query, [id]);
    
    console.log(`Fetched notifs: ${rows}`);
    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

module.exports = {
  getNotifications,
  addNotification,
};
