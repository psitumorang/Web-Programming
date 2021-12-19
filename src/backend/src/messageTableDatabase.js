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

const getNextOrderNumber = async (db, fromId, toId) => {
  const query = 'SELECT MAX(orderNumber) FROM msg_lst WHERE fromId=? AND toId=?';
  const params = [fromId, toId];

  try {
    const [row] = await db.execute(query, params);

    console.log(row);
    // eslint-disable-next-line no-console
    console.log(`Got max id: ${row[0]['MAX(orderNumber)']}`);
    //TODO: handle the case where this is the first message
    if (row[0]['MAX(orderNumber)'] === null) {
      return 0;
    } else {
      return row[0]['MAX(orderNumber)'] + 1;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: msg already exists');
    console.log(err);
  }
  return null;
};

// add text message from a user to another user
const addTextMessage = async (db, txt, fromId, toId, senderName, convoId) => {
  //need to get the order number
  const orderNumber = await getNextOrderNumber(db, fromId, toId);

  const query = 'INSERT INTO msg_lst (txt, fromId, toId, orderNumber, senderName, convoId) VALUES(?, ?, ?, ?, ?, ?)';
  const params = [txt, fromId, toId, orderNumber, senderName, convoId];

  try {
    const [row] = await db.execute(query, params);

    // eslint-disable-next-line no-console
    console.log(`Created msg: ${row}`);
    return row;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: msg already exists');
    console.log(err);
  }
  return null;
};

//TODO: will do after text message works e2e
// const addImageMessage = async (db, img, fromId, toId, senderName) => {
//   //need to get the order number
//   const orderNumber = getNextOrderNumber(db, fromId, toId);

//   const query = 'INSERT INTO msg_lst (txt, fromId, toid, orderNumber, senderName) VALUES(?, ?, ?, ?)';
//   const params = [txt, fromId, toId, orderNumber,senderName];
  
//   try {
//     const [row] = await db.execute(query, params);

//     // eslint-disable-next-line no-console
//     console.log(`Created admin: ${row}`);
//     return row;
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log('error: admin already exists');
//   }
//   return null;
// };

// const addAudioMessage = async (db, groupId, adminId, isCreator, name) => {
//   const query = 'INSERT INTO admin_lst (group_id, admin_id, is_creator, user_name) VALUES(?, ?, ?, ?)';

//   const params = [groupId, adminId, isCreator, name];
//   try {
//     const [row] = await db.execute(query, params);

//     // eslint-disable-next-line no-console
//     console.log(`Created admin: ${row}`);
//     return row;
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log('error: admin already exists');
//   }
//   return null;
// };

// const addVideoMessage = async (db, groupId, adminId, isCreator, name) => {
//   const query = 'INSERT INTO admin_lst (group_id, admin_id, is_creator, user_name) VALUES(?, ?, ?, ?)';

//   const params = [groupId, adminId, isCreator, name];
//   try {
//     const [row] = await db.execute(query, params);

//     // eslint-disable-next-line no-console
//     console.log(`Created admin: ${row}`);
//     return row;
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log('error: admin already exists');
//   }
//   return null;
// };

// get admins for group
const getConversation = async (db, convoId) => {
  const query = 'SELECT * FROM msg_lst WHERE convoId=? ORDER BY orderNumber ASC';

  const params = [convoId];

  try {
    const [rows] = await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Got messages: ${rows}`);
    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

module.exports = {
  connect,
  addTextMessage,
  // addImageMessage,
  // addVideoMessage,
  // addAudioMessage,
  getConversation,
};
