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
  console.log(notification.isRead, id, notification.msg);
  const query = 'INSERT INTO notification_lst (user_id, is_read, msg, date) VALUES(?, ?, ?, NOW())';

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
};

// gets all notifications for user
const getNotifications = async (db, id) => {
  const query = 'SELECT * FROM notification_lst WHERE user_id=? ORDER BY date DESC';

  try {
    const [rows] = await db.execute(query, [id]);

    // eslint-disable-next-line no-console
    console.log(`Fetched notifs: ${rows}`);
    // change the rows we just fetched to be read now!
    const readQuery = 'UPDATE notification_lst SET is_read=true WHERE is_read=false';
    await db.execute(readQuery);

    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

module.exports = {
  connect,
  getNotifications,
  addNotification,
};
