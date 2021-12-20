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

// add a group
const addGroup = async (db, newGroup) => {
  const query = 'INSERT INTO group_lst (group_id, group_name, group_creator, group_description, is_public, member_number) VALUES(?, ?, ?, ?, ?, 1)';

  const verifyQuery = 'SELECT COUNT(*) FROM group_lst WHERE group_name=?';

  const params = [newGroup.group_id, newGroup.group_name, newGroup.group_creator,
    newGroup.group_description, newGroup.is_public];
  try {
    const [verifyRow] = await db.execute(verifyQuery, [newGroup.group_name]);
    if (verifyRow[0]['COUNT(*)'] !== 0) {
      // Another group has the same groupname!
      return null;
    }

    await db.execute(query, params);
    // eslint-disable-next-line no-console
    console.log(`Created group with id: ${newGroup.group_id}`);
    return newGroup.group_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// add first topics when new group is created
const addTopics = async (db, newTopics) => {
  const query = 'INSERT INTO group_topics (group_id, group_topic) VALUES(?, ?)';

  const param1 = [newTopics.group_id, newTopics.topic_1];
  const param2 = [newTopics.group_id, newTopics.topic_2];
  const param3 = [newTopics.group_id, newTopics.topic_3];

  if (newTopics.topic_1) {
    try {
      await db.execute(query, param1);
      // eslint-disable-next-line no-console
      console.log(`Created topic: ${newTopics.topic_1} for group with id: ${newTopics.group_id}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`error: ${err.message}`);
    }
  }

  if (newTopics.topic_2) {
    try {
      await db.execute(query, param2);
      // eslint-disable-next-line no-console
      console.log(`Created topic: ${newTopics.topic_2} for group with id: ${newTopics.group_id}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`error: ${err.message}`);
    }
  }

  if (newTopics.topic_3) {
    try {
      await db.execute(query, param3);
      // eslint-disable-next-line no-console
      console.log(`Created topic: ${newTopics.topic_3} for group with id: ${newTopics.group_id}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`error: ${err.message}`);
    }
  }
};

// get all groups with same groupname
const getTopics = async (db) => {
  try {
    const query = 'SELECT DISTINCT group_topic FROM group_topics';
    const [rows] = await db.execute(query);
    // eslint-disable-next-line no-console
    console.log(`groups: ${JSON.stringify(rows)}`);

    const topics = [];
    for (let i = 0; i < rows.length; i += 1) {
      topics.push(rows[i]['group_topic']);
    }

    return topics;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all groups with same groupname
const getTopicsByGroupId = async (db, id) => {
  try {
    const query = 'SELECT DISTINCT group_topic FROM group_topics where group_id=?';
    const [rows] = await db.execute(query, [id]);
    // eslint-disable-next-line no-console
    console.log(`groups: ${JSON.stringify(rows)}`);

    const topics = [];
    for (let i = 0; i < rows.length; i += 1) {
      topics.push(rows[i]['group_topic']);
    }

    return topics;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all groups with same groupname
const getGroupsWithTopic = async (db, topic) => {
  console.log('get groups with topic');
  try {
    const query = 'SELECT * FROM group_topics WHERE group_topic=?';
    const [rows] = await db.execute(query, [topic]);
    // eslint-disable-next-line no-console
    console.log(`groups: ${JSON.stringify(rows[0])}`);

    let groups = [];
    for (let i = 0; i < rows.length; i += 1) {
      const g = await getGroupById(db, rows[i].group_id);
      const topics = await getTopicsByGroupId(db, rows[i].group_id);

      console.log(g);
      if (g.is_public === 1) {
        g.topics = topics;
        groups.push(g);
      }
    }

    return [groups];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all groups
const getPublicGroups = async (db, sort) => {
  try {
    let query = '';
    if (sort === 'newest') {
      query = 'SELECT * FROM group_lst WHERE is_public=1 ORDER BY last_post DESC';
    }
    if (sort === 'posts') {
      query = 'SELECT * FROM group_lst WHERE is_public=1 ORDER BY post_number DESC';
    }
    if (sort === 'members') {
      query = 'SELECT * FROM group_lst WHERE is_public=1 ORDER BY member_number DESC';
    } else {
      query = 'SELECT * FROM group_lst WHERE is_public=1';
    }
    const [rows] = await db.execute(query);
    // eslint-disable-next-line no-console
    console.log(`Group: ${JSON.stringify(rows)}`);

    const groups = [];
    for (let i = 0; i < rows.length; i += 1) {
      const g = await getTopicsByGroupId(db, rows[i].group_id);

      console.log(g);
      rows[i].topics = g;
    }

    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all groups
const getGroups = async (db) => {
  try {
    const query = 'SELECT * FROM group_lst';
    const [rows] = await db.execute(query);
    // eslint-disable-next-line no-console
    console.log(`Group: ${JSON.stringify(rows)}`);
    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get group by its id
const getGroupById = async (db, id) => {
  try {
    const query = 'SELECT * FROM group_lst WHERE group_id=?';
    const [rows] = await db.execute(query, [id]);
    // eslint-disable-next-line no-console
    // console.log(`Group: ${JSON.stringify(rows)}`);
    return rows[0];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// get all groups with same groupname
const getGroupsWithName = async (db, name) => {
  try {
    const query = 'SELECT * FROM group_lst WHERE group_lst.group_name=?';
    const [rows] = await db.execute(query, [name]);
    // eslint-disable-next-line no-console
    console.log(`groups: ${JSON.stringify(rows)}`);
    return [rows];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// delete group by name
const deleteGroup = async (db, name) => {
  try {
    const query = 'DELETE FROM group_lst.group_name WHERE group_name=?';
    const [row] = await db.execute(query, [name]);
    // eslint-disable-next-line no-console
    console.log(`Deleted ${JSON.stringify(row.affectedRows)} group(s)`);
    return [row];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

// update a group
const updateGroup = async (db, groupId, paramToUpdate, updateValue) => {
  try {
    const query = 'UPDATE group_lst SET ?=? WHERE group_id=?';
    const params = [paramToUpdate, updateValue, groupId];
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
    const query = 'SELECT MAX(group_id) FROM group_lst';
    const [row] = await db.execute(query);
    return row[0]['MAX(group_id)'];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message}`);
  }
  return null;
};

const getAnalyticsFacts = async (db) => {
  const analyticsFactsData = [];
  
  // total groups
  const totalGroupsQuery = "SELECT COUNT(*) as total_groups FROM group_lst";
  const [[totalGroupsResult]] = await db.execute(totalGroupsQuery);
  analyticsFactsData.push(['Total groups', totalGroupsResult.total_groups]);

  // total members
  const totalMembersQuery = "SELECT COUNT(*) as total_memberships FROM group_members";
  const [[totalMembersResult]] = await db.execute(totalMembersQuery);
  analyticsFactsData.push(['Total memberships', totalMembersResult.total_memberships]);

  // average members per group
  const averageMembers = totalMembersResult.total_memberships / totalGroupsResult.total_groups;
  analyticsFactsData.push(['Average members per group', averageMembers]);

  // outstanding invitations
  const totalInvitesQuery = "SELECT COUNT(*) as total_invites FROM invitations";
  const [[totalInvitesResult]] = await db.execute(totalInvitesQuery);
  analyticsFactsData.push(['Total invitations', totalInvitesResult.total_invites]);

  // number of admins
  const totalAdminsQuery = "SELECT COUNT(*) as total_admins FROM admin_lst";
  const [[totalAdminsResult]] = await db.execute(totalAdminsQuery);
  analyticsFactsData.push(['Total admin roles', totalAdminsResult.total_admins]);

  // return the Array of factname:value pairs
  return analyticsFactsData;
};

module.exports = {
  connect,
  addGroup,
  addTopics,
  getGroups,
  getGroupsWithName,
  deleteGroup,
  updateGroup,
  getNextId,
  getGroupById,
  getAnalyticsFacts,
  getTopics,
  getGroupsWithTopic,
  getPublicGroups,
};
