const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'database-1.cqgwv4rlupdn.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'staceyshapiro',
    database: 'db1',
  },
});

const adminLib = require('../adminTableDatabase');
const convoLib = require('../convoTableDatabase');
const userLib = require('../userTableDatabase');
const groupLib = require('../groupTableDatabase');
const groupMemberLib = require('../groupMemberTableDatabase');
const inviteLib = require('../invitationTableDatabase');
const msgLib = require('../messageTableDatabase');
const notifLib = require('../notificationTableDatabase');
const postLib = require('../postTableDatabase');
const profileLib = require('../profileTableDatabase');
const replyLib = require('../replyTableDatabase');

let db;

describe('admin database operations tests', () => {
  let done = false;

  beforeAll(async () => {
    if (!done) {
      db = await adminLib.connect();
      done = true;
    }
  });

  test('test add admin for group success', async () => {
    const row = await adminLib.addAdminForGroup(db, -1, -1, 1, 'me');
    const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
    expect(newAdmin[0].admin_id).toBe(-1);
    expect(newAdmin[0].group_id).toBe(-1);
    expect(newAdmin[0].is_creator).toBe(1);
    expect(newAdmin[0].user_name).toBe('me');
    await knex('admin_lst').where('admin_id', -1).del();
  });

  test('test add admin for group unsuccessful', async () => {
    const row = await adminLib.addAdminForGroup(db, -1, -1, 1, 'me');
    const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
    expect(newAdmin[0].admin_id).toBe(-1);
    expect(newAdmin[0].group_id).toBe(-1);
    expect(newAdmin[0].is_creator).toBe(1);
    expect(newAdmin[0].user_name).toBe('me');
    const row1 = await adminLib.addAdminForGroup(db, -1, -1, 1, 'me');
    const newAdmin2 = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
    expect(row1).toBe(null);
    expect(newAdmin2.length).toBe(1);
    await knex('admin_lst').where('admin_id', -1).del();
  });

  test('test get admin for group success', async () => {
    const row = await adminLib.addAdminForGroup(db, -1, -1, 1, 'me');
    const groups = await adminLib.getAdmins(db, -1);
    const newGroups = await knex.select('*').from('admin_lst').where('group_id', '=', -1);
    expect(newGroups[0].admin_id).toBe(-1);
    expect(newGroups[0].group_id).toBe(-1);
    expect(newGroups[0].is_creator).toBe(1);
    expect(newGroups[0].user_name).toBe('me');
    await knex('admin_lst').where('admin_id', -1).del();
  });

  test('test get admin for group unsuccessful', async () => {
    const groups = await adminLib.getAdmins(db, -5);
    expect(groups).toStrictEqual([]);
  });

  test('test get all admins successful', async () => {
    await adminLib.addAdminForGroup(db, -1, -1, 1, 'me');
    await adminLib.addAdminForGroup(db, -2, -2, 1, 'you');
    await adminLib.addAdminForGroup(db, -3, -3, 1, 'them');
    const groups = await adminLib.getAllAdmins(db, -1);
    expect(groups['-1'].length >= 1).toBe(true);
    expect(groups['-2'].length >= 1).toBe(true);
    expect(groups['-3'].length >= 1).toBe(true);
    await knex('admin_lst').where('admin_id', -2).del();
    await knex('admin_lst').where('admin_id', -1).del();
    await knex('admin_lst').where('admin_id', -3).del();
  });

  test('test get groups adminned by user successful', async () => {
    await adminLib.addAdminForGroup(db, -1, -1, 1, 'me');
    await adminLib.addAdminForGroup(db, -2, -1, 1, 'me');
    await adminLib.addAdminForGroup(db, -3, -1, 1, 'me');
    const groups = await adminLib.getAdministeredGroups(db, -1);
    expect(groups).toStrictEqual([{ group_id: -3 }, { group_id: -2 }, { group_id: -1 }]);
    const list = await knex.select('group_id').from('admin_lst').where('admin_id', '=', -1);
    expect(list[0].group_id).toBe(-3);
    expect(list[1].group_id).toBe(-2);
    expect(list[2].group_id).toBe(-1);
    await knex('admin_lst').where('admin_id', -3).del();
    await knex('admin_lst').where('admin_id', -1).del();
    await knex('admin_lst').where('admin_id', -2).del();
  });

  test('test revoke admin for group success', async () => {
    const row = await adminLib.addAdminForGroup(db, -1, -1, 0, 'me');
    const groups = await adminLib.revokeAdmin(db, -1, 'me');
    const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
    expect(newAdmin.length).toBe(0);
  });

  test('test revoke admin for group unsuccessful', async () => {
    const row = await adminLib.addAdminForGroup(db, -1, -1, 1, 'me');
    const groups = await adminLib.revokeAdmin(db, -1, 'me');
    expect(groups.err.message).toBe('admin is creator of group, cannot be revoked');
    const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
    expect(newAdmin[0].admin_id).toBe(-1);
    expect(newAdmin[0].group_id).toBe(-1);
    expect(newAdmin[0].is_creator).toBe(1);
    expect(newAdmin[0].user_name).toBe('me');
    await knex('admin_lst').where('admin_id', -1).del();
  });

  test('test delete admins', async () => {
    const row = await adminLib.addAdminForGroup(db, -1, -1, 0, 'me');
    const groups = await adminLib.deleteAdmins(db, -1);
    const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
    expect(newAdmin.length).toBe(0);
    await knex('admin_lst').where('admin_id', -1).del();
  });

  test('add convo no error', async () => {
    const row = await convoLib.addConvo(db, -1, -2, 'me', 'them');
    const convo = await knex.select('*').from('convo_lst').where('convoId', row);

    expect(convo[0].user1).toBe(-1);
    expect(convo[0].user2).toBe(-2);
    expect(convo[0].user1Name).toBe('me');
    expect(convo[0].user2Name).toBe('them');
    expect(convo[0].convoId).toBe(row);
    await knex('convo_lst').where('convoId', row).del();
  });

  test('convo exists', async () => {
    const row = await convoLib.addConvo(db, -1, -2, 'me', 'them');
    const exists = await convoLib.convoExists(db, -1, -2);
    const exists2 = await convoLib.convoExists(db, -2, -1);
    const exists3 = await convoLib.convoExists(db, -3, -4);
    expect(exists).toBe(true);
    expect(exists2).toBe(true);
    expect(exists3).toBe(false);
    await knex('convo_lst').where('convoId', row).del();
  });

  test('get convo id', async () => {
    const row = await convoLib.addConvo(db, -1, -2, 'me', 'them');
    const convo = await knex.select('*').from('convo_lst').where('convoId', row);
    const id = await convoLib.getConvoId(db, -1, -2);
    const id2 = await convoLib.getConvoId(db, -2, -1);
    expect(convo[0].convoId).toBe(row);
    expect(id).toBe(row);
    expect(id2).toBe(row);
    await knex('convo_lst').where('convoId', row).del();
  });

  test('get convos for user', async () => {
    const row = await convoLib.addConvo(db, -1, -2, 'me', 'them');
    const row2 = await convoLib.addConvo(db, -4, -1, 'they', 'me');
    const convo = await knex.select('*').from('convo_lst').where('user1', -1);
    const convo2 = await knex.select('*').from('convo_lst').where('user2', -1);
    const ret = await convoLib.getConvosForUser(db, -1);

    expect(convo[0].user1).toBe(-1);
    expect(convo2[0].user2).toBe(-1);
    expect(ret.length).toBe(2);

    expect(convo[0].convoId).toBe(row);
    await knex('convo_lst').where('convoId', row).del();
    await knex('convo_lst').where('convoId', row2).del();
  });

  test('add group member', async () => {
    await knex('user_lst').insert({ user_id: -1, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -1, group_name: 'group', group_creator: -1, group_description: 'description', is_public: 1,
    });
    const row = await groupMemberLib.addGroupMember(db, -1, -1);
    const convo = await knex.select('*').from('group_members').where('group_id', -1);
    const select = await knex.select('*').from('group_lst').where('group_id', -1);

    expect(convo[0].group_id).toBe(-1);
    expect(convo[0].member_id).toBe(-1);
    expect(select[0].member_number).toBe(1);
    await knex('group_members').where('group_id', -1).del();
    await knex('group_lst').where('group_id', -1).del();
    await knex('user_lst').where('user_id', -1).del();
  });

  test('get member ids', async () => {
    await knex('user_lst').insert({ user_id: -2, user_name: 'me', user_password: 'password' });
    await knex('user_lst').insert({ user_id: -3, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -2, group_name: 'group', group_creator: -2, group_description: 'description', is_public: 1,
    });
    await knex('group_members').insert({ group_id: -2, member_id: -2 });
    await knex('group_members').insert({ group_id: -2, member_id: -3 });
    const members = await groupMemberLib.getMemberIds(db, -2);
    const convo = await knex.select('*').from('group_members').where('group_id', -2);
    expect(members[0].member_id).toBe(-3);
    expect(members[1].member_id).toBe(-2);
    await knex('group_members').where('group_id', -2).del();
    await knex('group_members').where('group_id', -3).del();
    await knex('group_lst').where('group_id', -2).del();
    await knex('user_lst').where('user_id', -2).del();
    await knex('user_lst').where('user_id', -3).del();
  });

  test('get group memberships by user id', async () => {
    await knex('user_lst').insert({ user_id: -5, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -4, group_name: 'group', group_creator: -5, group_description: 'description', is_public: 1,
    });
    await knex('group_lst').insert({
      group_id: -5, group_name: 'group', group_creator: -5, group_description: 'description', is_public: 1,
    });
    await knex('group_members').insert({ group_id: -5, member_id: -5 });
    await knex('group_members').insert({ group_id: -4, member_id: -5 });
    const members = await groupMemberLib.getGroupMembershipsByUserId(db, -5);
    const convo = await knex.select('*').from('group_members').where('member_id', -5);
    expect(convo[0].group_id).toBe(-5);
    expect(convo[1].group_id).toBe(-4);
    expect(members[0].group_id).toBe(-5);
    expect(members[1].group_id).toBe(-4);
    await knex('group_members').where('group_id', -5).del();
    await knex('group_members').where('group_id', -4).del();
    await knex('group_lst').where('group_id', -5).del();
    await knex('group_lst').where('group_id', -4).del();
    await knex('user_lst').where('user_id', -5).del();
  });

  test('delete membership by user id', async () => {
    await knex('user_lst').insert({ user_id: -4, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -3, group_name: 'group', group_creator: -4, group_description: 'description', is_public: 1,
    });
    await knex('group_members').insert({ group_id: -3, member_id: -4 });
    const members = await groupMemberLib.deleteUserMemberships(db, -4);
    const convo = await knex.select('*').from('group_members').where('member_id', -4);
    expect(convo.length).toBe(0);
    await knex('group_lst').where('group_id', -3).del();
    await knex('user_lst').where('user_id', -4).del();
  });

  test('delete memberships by group id and user id', async () => {
    await knex('user_lst').insert({ user_id: -6, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -6, group_name: 'group', group_creator: -6, group_description: 'description', is_public: 1,
    });
    await knex('group_members').insert({ group_id: -6, member_id: -6 });
    const members = await groupMemberLib.deleteSingleMembership(db, -6, -6);
    const convo = await knex.select('*').from('group_members').where('member_id', -6);
    expect(convo.length).toBe(0);
    await knex('group_lst').where('group_id', -6).del();
    await knex('user_lst').where('user_id', -6).del();
  });

  test('get groups for user', async () => {
    await knex('user_lst').insert({ user_id: -7, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -7, group_name: 'group', group_creator: -7, group_description: 'description', is_public: 1,
    });
    await knex('group_lst').insert({
      group_id: -8, group_name: 'group', group_creator: -7, group_description: 'description', is_public: 1,
    });
    await knex('group_members').insert({ group_id: -7, member_id: -7 });
    await knex('group_members').insert({ group_id: -8, member_id: -7 });
    const members = await groupMemberLib.getGroupsForUser(db, -7);
    expect(members).toStrictEqual([-8, -7]);
    await knex('group_members').where('group_id', -7).del();
    await knex('group_members').where('group_id', -8).del();
    await knex('group_lst').where('group_id', -7).del();
    await knex('group_lst').where('group_id', -8).del();
    await knex('user_lst').where('user_id', -7).del();
  });

  test('add invitation', async () => {
    const invite = await inviteLib.addInvitation(db, {
      toUserId: -1, fromUserId: -2, invitationStatus: 'pending', groupId: -1,
    });
    const ret = await knex.select('*').from('invitations').where('invitation_id', invite.insertId);

    expect(ret[0].invitation_id).toBe(invite.insertId);
    expect(ret[0].to_user_id).toBe(-1);
    expect(ret[0].from_user_id).toBe(-2);
    expect(ret[0].invitation_status).toBe('pending');
    expect(ret[0].group_id).toBe(-1);
    await knex('invitations').where('group_id', -1).del();
  });

  test('get pending invitations', async () => {
    const invite = await inviteLib.addInvitation(db, {
      toUserId: -3, fromUserId: -4, invitationStatus: 'pending', groupId: -2,
    });
    const pending = await inviteLib.getPendingInvitations(db, -3);

    expect(pending[0].invitation_id).toBe(invite.insertId);
    expect(pending[0].to_user_id).toBe(-3);
    expect(pending[0].from_user_id).toBe(-4);
    expect(pending[0].invitation_status).toBe('pending');
    expect(pending[0].group_id).toBe(-2);
    await knex('invitations').where('group_id', -2).del();
  });

  test('update invitation status', async () => {
    const invite = await inviteLib.addInvitation(db, {
      toUserId: -5, fromUserId: -6, invitationStatus: 'pending', groupId: -3,
    });
    const ret1 = await knex.select('*').from('invitations').where('invitation_id', invite.insertId);
    expect(ret1[0].invitation_status).toBe('pending');

    const pending = await inviteLib.updateInvitationStatus(db, invite.insertId, 'declined');
    const ret = await knex.select('*').from('invitations').where('invitation_id', invite.insertId);

    expect(ret[0].invitation_id).toBe(invite.insertId);
    expect(ret[0].to_user_id).toBe(-5);
    expect(ret[0].from_user_id).toBe(-6);
    expect(ret[0].invitation_status).toBe('declined');
    expect(ret[0].group_id).toBe(-3);
    await knex('invitations').where('group_id', -3).del();
  });

  test('delete pending invites', async () => {
    const invite = await inviteLib.addInvitation(db, {
      toUserId: -7, fromUserId: -8, invitationStatus: 'pending', groupId: -5,
    });
    const ret1 = await knex.select('*').from('invitations').where('invitation_id', invite.insertId);
    expect(ret1[0].invitation_status).toBe('pending');

    const pending = await inviteLib.deletePendingInvites(db, -7);
    const ret = await knex.select('*').from('invitations').where('group_id', -5);
    expect(ret.length).toBe(0);

    await knex('invitations').where('group_id', -5).del();
  });

  test('get open invites by group id', async () => {
    const invite = await inviteLib.addInvitation(db, {
      toUserId: -9, fromUserId: -10, invitationStatus: 'pending', groupId: -4,
    });
    const ret1 = await knex.select('*').from('invitations').where('invitation_id', invite.insertId);
    expect(ret1[0].invitation_status).toBe('pending');

    const pending = await inviteLib.getOpenInvitesByGroupId(db, -4);
    expect(pending[0].invitation_id).toBe(invite.insertId);
    expect(pending[0].to_user_id).toBe(-9);
    expect(pending[0].from_user_id).toBe(-10);
    expect(pending[0].invitation_status).toBe('pending');
    expect(pending[0].group_id).toBe(-4);

    await knex('invitations').where('group_id', -4).del();
  });

  test('add text message', async () => {
    const msg = await msgLib.addTextMessage(db, 'hello', -1, -2, 'me', -1);

    const ret = await knex.select('*').from('msg_lst').where('convoId', -1);

    expect(ret[0].txt).toBe('hello');
    expect(ret[0].fromId).toBe(-1);
    expect(ret[0].toId).toBe(-2);
    expect(ret[0].orderNumber).toBe(0);
    expect(ret[0].senderName).toBe('me');
    expect(ret[0].convoId).toBe(-1);

    const msg2 = await msgLib.addTextMessage(db, 'next', -1, -2, 'me', -1);
    const ret2 = await knex.select('*').from('msg_lst').where('convoId', -1);
    expect(ret2[1].orderNumber).toBe(1);
    await knex('msg_lst').where('convoId', -1).del();
  });

  test('add image message', async () => {
    const msg = await msgLib.addImageMessage(db, 'image url', -1, -2, 'me', -1);

    const ret = await knex.select('*').from('msg_lst').where('convoId', -1);

    expect(ret[0].img).toBe('image url');
    expect(ret[0].fromId).toBe(-1);
    expect(ret[0].toId).toBe(-2);
    expect(ret[0].orderNumber).toBe(0);
    expect(ret[0].senderName).toBe('me');
    expect(ret[0].convoId).toBe(-1);

    await knex('msg_lst').where('convoId', -1).del();
  });

  test('add audio message', async () => {
    const msg = await msgLib.addAudioMessage(db, 'audio url', -1, -2, 'me', -1);

    const ret = await knex.select('*').from('msg_lst').where('convoId', -1);

    expect(ret[0].audio).toBe('audio url');
    expect(ret[0].fromId).toBe(-1);
    expect(ret[0].toId).toBe(-2);
    expect(ret[0].orderNumber).toBe(0);
    expect(ret[0].senderName).toBe('me');
    expect(ret[0].convoId).toBe(-1);

    await knex('msg_lst').where('convoId', -1).del();
  });

  test('add video message', async () => {
    const msg = await msgLib.addVideoMessage(db, 'video url', -1, -2, 'me', -1);

    const ret = await knex.select('*').from('msg_lst').where('convoId', -1);

    expect(ret[0].video).toBe('video url');
    expect(ret[0].fromId).toBe(-1);
    expect(ret[0].toId).toBe(-2);
    expect(ret[0].orderNumber).toBe(0);
    expect(ret[0].senderName).toBe('me');
    expect(ret[0].convoId).toBe(-1);

    await knex('msg_lst').where('convoId', -1).del();
  });

  test('get conversation', async () => {
    const msg = await msgLib.addImageMessage(db, 'image url', -1, -2, 'me', -1);
    const msg1 = await msgLib.addVideoMessage(db, 'video url', -1, -2, 'me', -1);
    const convo = await msgLib.getConversation(db, -1, -1);
    expect(convo[1].video).toBe('video url');
    expect(convo[0].img).toBe('image url');

    await knex('msg_lst').where('convoId', -1).del();
  });

  test('add notification', async () => {
    const notif = await notifLib.addNotification(db, -1, { isRead: false, msg: 'hi' });
    const ret = await knex.select('*').from('notification_lst').where('msg', 'hi');

    expect(ret[0].user_id).toBe(-1);
    expect(ret[0].is_read).toBe(0);
    expect(ret[0].msg).toBe('hi');

    await knex('notification_lst').where('user_id', -1).del();
  });

  test('get notification', async () => {
    await notifLib.addNotification(db, -1, { isRead: false, msg: 'hi' });
    const notif = await notifLib.getNotifications(db, -1);
    expect(notif[0].user_id).toBe(-1);
    expect(notif[0].is_read).toBe(0);
    expect(notif[0].msg).toBe('hi');
    await knex('notification_lst').where('user_id', -1).del();
  });

  test('add group no error', async () => {
    await knex('user_lst').insert({ user_id: -10, user_name: 'me', user_password: 'password' });
    const group = await groupLib.addGroup(db, {
      group_id: -10, group_name: 'name', group_creator: -10, group_description: 'description', is_public: 1,
    });
    const check = await knex.select('*').from('group_lst').where('group_id', -10);

    expect(check[0].group_id).toBe(-10);
    expect(check[0].group_name).toBe('name');
    expect(check[0].group_creator).toBe(-10);
    expect(check[0].group_description).toBe('description');
    expect(check[0].is_public).toBe(1);

    await knex('group_lst').where('group_id', -10).del();
    await knex('user_lst').where('user_id', -10).del();
  });

  test('add group error', async () => {
    await knex('user_lst').insert({ user_id: -11, user_name: 'me', user_password: 'password' });
    const group = await groupLib.addGroup(db, {
      group_id: -11, group_name: 'name', group_creator: -11, group_description: 'description', is_public: 1,
    });
    const group2 = await groupLib.addGroup(db, {
      group_id: -12, group_name: 'name', group_creator: -11, group_description: 'description', is_public: 1,
    });

    expect(group2).toBe(null);
    await knex('group_lst').where('group_id', -12).del();
    await knex('group_lst').where('group_id', -11).del();
    await knex('user_lst').where('user_id', -11).del();
  });

  test('add topics for group', async () => {
    await knex('user_lst').insert({ user_id: -12, user_name: 'me', user_password: 'password' });
    const group = await groupLib.addGroup(db, {
      group_id: -13, group_name: 'name1', group_creator: -12, group_description: 'description', is_public: 1,
    });
    const topics = await groupLib.addTopics(db, {
      group_id: -13, topic_1: 'topic1', topic_2: 'topic2', topic_3: 'topic3',
    });
    const retTopics = await knex.select('*').from('group_topics').where('group_id', -13);

    expect(retTopics[0].group_id).toBe(-13);
    expect(retTopics[0].group_topic).toBe('topic1');
    expect(retTopics[1].group_id).toBe(-13);
    expect(retTopics[1].group_topic).toBe('topic2');
    expect(retTopics[2].group_id).toBe(-13);
    expect(retTopics[2].group_topic).toBe('topic3');

    await knex('group_topics').where('group_id', -13).del();
    await knex('group_topics').where('group_id', -13).del();
    await knex('group_topics').where('group_id', -13).del();
    await knex('group_lst').where('group_id', -13).del();
    await knex('user_lst').where('user_id', -12).del();
  });

  test('get all topics', async () => {
    await knex('user_lst').insert({ user_id: -12, user_name: 'me', user_password: 'password' });
    const group = await groupLib.addGroup(db, {
      group_id: -13, group_name: 'name1', group_creator: -12, group_description: 'description', is_public: 1,
    });
    await groupLib.addTopics(db, {
      group_id: -13, topic_1: 'topic1', topic_2: 'topic2', topic_3: 'topic3',
    });
    const topics = await groupLib.getTopics(db);

    expect(topics.length > 2).toBe(true);

    await knex('group_topics').where('group_id', -13).del();
    await knex('group_topics').where('group_id', -13).del();
    await knex('group_topics').where('group_id', -13).del();
    await knex('group_lst').where('group_id', -13).del();
    await knex('user_lst').where('user_id', -12).del();
  });

  test('get topics for group', async () => {
    await knex('user_lst').insert({ user_id: -14, user_name: 'me', user_password: 'password' });
    const group = await groupLib.addGroup(db, {
      group_id: -14, group_name: 'name2', group_creator: -14, group_description: 'description', is_public: 1,
    });
    await groupLib.addTopics(db, {
      group_id: -14, topic_1: 'topic1', topic_2: 'topic2', topic_3: 'topic3',
    });
    const topics = await groupLib.getTopicsByGroupId(db, -14);

    expect(topics[0]).toBe('topic1');
    expect(topics[1]).toBe('topic2');
    expect(topics[2]).toBe('topic3');
    expect(topics.length > 2).toBe(true);

    await knex('group_topics').where('group_id', -14).del();
    await knex('group_topics').where('group_id', -14).del();
    await knex('group_topics').where('group_id', -14).del();
    await knex('group_lst').where('group_id', -14).del();
    await knex('user_lst').where('user_id', -14).del();
  });

  test('get groups with topic', async () => {
    await knex('user_lst').insert({ user_id: -15, user_name: 'me', user_password: 'password' });
    const group = await groupLib.addGroup(db, {
      group_id: -15, group_name: 'name2', group_creator: -15, group_description: 'description', is_public: 1,
    });
    const group2 = await groupLib.addGroup(db, {
      group_id: -16, group_name: 'name3', group_creator: -15, group_description: 'description', is_public: 1,
    });
    await groupLib.addTopics(db, { group_id: -15, topic_1: 'topic1' });
    await groupLib.addTopics(db, { group_id: -16, topic_1: 'topic1' });
    const topics = await groupLib.getGroupsWithTopic(db, 'topic1');
    expect(topics[0][0].group_id).toBe(-16);
    expect(topics[0][1].group_id).toBe(-15);
    expect(topics[0].length > 1).toBe(true);

    await knex('group_topics').where('group_id', -15).del();
    await knex('group_topics').where('group_id', -16).del();
    await knex('group_lst').where('group_id', -15).del();
    await knex('group_lst').where('group_id', -16).del();
    await knex('user_lst').where('user_id', -15).del();
  });

  test('get public groups (sorting)', async () => {
    await knex('user_lst').insert({ user_id: -16, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -17, group_name: 'group1', group_creator: -16, group_description: 'description', is_public: 1, member_number: 4, post_number: 100,
    });
    await knex('group_lst').insert({
      group_id: -18, group_name: 'group2', group_creator: -16, group_description: 'description', is_public: 1, member_number: 60, post_number: 0,
    });
    const group1 = await groupLib.getPublicGroups(db, 'none');

    expect(group1[0][0].group_id).toBe(-18);
    expect(group1[0][1].group_id).toBe(-17);
    expect(group1[0].length > 1).toBe(true);

    const group2 = await groupLib.getPublicGroups(db, 'newest');

    expect(group2[0][0].group_id === -18).toBe(false);
    expect(group2[0].length > 1).toBe(true);

    const group3 = await groupLib.getPublicGroups(db, 'posts');

    expect(group3[0][0].group_id).toBe(-17);
    expect(group3[0].length > 1).toBe(true);

    const group4 = await groupLib.getPublicGroups(db, 'members');

    expect(group4[0][0].group_id).toBe(-18);
    expect(group4[0].length > 1).toBe(true);

    await knex('group_lst').where('group_id', -18).del();
    await knex('group_lst').where('group_id', -17).del();
    await knex('user_lst').where('user_id', -16).del();
  });

  test('get groups', async () => {
    await knex('user_lst').insert({ user_id: -19, user_name: 'me', user_password: 'password' });
    const group = await groupLib.addGroup(db, {
      group_id: -19, group_name: 'name2', group_creator: -19, group_description: 'description', is_public: 1,
    });
    const group2 = await groupLib.addGroup(db, {
      group_id: -20, group_name: 'name3', group_creator: -19, group_description: 'description', is_public: 1,
    });
    const topics = await groupLib.getGroups(db);
    expect(topics[0][0].group_id).toBe(-20);
    expect(topics[0][1].group_id).toBe(-19);
    expect(topics[0].length > 1).toBe(true);

    await knex('group_lst').where('group_id', -19).del();
    await knex('group_lst').where('group_id', -20).del();
    await knex('user_lst').where('user_id', -19).del();
  });

  test('get groups by id', async () => {
    await knex('user_lst').insert({ user_id: -20, user_name: 'me', user_password: 'password' });
    const group2 = await groupLib.addGroup(db, {
      group_id: -21, group_name: 'name3', group_creator: -20, group_description: 'description', is_public: 1,
    });
    const topics = await groupLib.getGroupById(db, -21);
    expect(topics.group_id).toBe(-21);

    await knex('group_lst').where('group_id', -21).del();
    await knex('user_lst').where('user_id', -20).del();
  });

  test('get groups by with name', async () => {
    await knex('user_lst').insert({ user_id: -21, user_name: 'me', user_password: 'password' });
    const group2 = await groupLib.addGroup(db, {
      group_id: -22, group_name: 'name3', group_creator: -21, group_description: 'description', is_public: 1,
    });
    const topics = await groupLib.getGroupsWithName(db, 'name3');
    expect(topics[0][0].group_id).toBe(-22);

    await knex('group_lst').where('group_id', -22).del();
    await knex('user_lst').where('user_id', -21).del();
  });

  test('delete group', async () => {
    await knex('user_lst').insert({ user_id: -22, user_name: 'me', user_password: 'password' });
    const group2 = await groupLib.addGroup(db, {
      group_id: -23, group_name: 'name3', group_creator: -22, group_description: 'description', is_public: 1,
    });
    const topics = await groupLib.deleteGroup(db, 'name3');
    const convo = await knex.select('*').from('group_lst').where('group_id', -23);
    expect(convo.length).toBe(0);
    await knex('group_lst').where('group_id', -23).del();
    await knex('user_lst').where('user_id', -22).del();
  });

  test('update group', async () => {
    await knex('user_lst').insert({ user_id: -23, user_name: 'me', user_password: 'password' });
    const group2 = await groupLib.addGroup(db, {
      group_id: -24, group_name: 'name3', group_creator: -23, group_description: 'description', is_public: 1,
    });
    const convo = await knex.select('*').from('group_lst').where('group_id', -24);
    expect(convo[0].group_name).toBe('name3');
    const change = await groupLib.updateGroup(db, -24, 'group_name', 'newName');
    const convo2 = await knex.select('*').from('group_lst').where('group_id', -24);
    expect(convo2[0].group_name).toBe('newName');
    await knex('group_lst').where('group_id', -24).del();
    await knex('user_lst').where('user_id', -23).del();
  });

  test('get next id', async () => {
    const number = await groupLib.getNextId(db);
    expect(typeof number).toBe('number');
  });

  test('get analytics facts', async () => {
    const analytics = await groupLib.getAnalyticsFacts(db);
    expect(analytics.length).toBe(5);
    expect(typeof analytics[0]).toBe('object');
    expect(typeof analytics[1]).toBe('object');
    expect(typeof analytics[2]).toBe('object');
    expect(typeof analytics[3]).toBe('object');
    expect(typeof analytics[4]).toBe('object');
  });

  test('add text post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    const post = await postLib.addTextPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', posting_username: 'me',
    });
    const ret = await knex.select('*').from('post_lst').where('post_id', -40);

    expect(ret[0].post_id).toBe(-40);
    expect(ret[0].post_group).toBe(-40);
    expect(ret[0].posting_user).toBe(-40);
    expect(ret[0].caption).toBe('yup');
    expect(ret[0].posting_username).toBe('me');

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('add image post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    const post = await postLib.addImagePost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', photourl: 'url', posting_username: 'me',
    });
    const ret = await knex.select('*').from('post_lst').where('post_id', -40);

    expect(ret[0].post_id).toBe(-40);
    expect(ret[0].post_group).toBe(-40);
    expect(ret[0].posting_user).toBe(-40);
    expect(ret[0].caption).toBe('yup');
    expect(ret[0].photourl).toBe('url');
    expect(ret[0].posting_username).toBe('me');

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('add audio post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    const post = await postLib.addAudioPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', audioUrl: 'url', posting_username: 'me',
    });
    const ret = await knex.select('*').from('post_lst').where('post_id', -40);

    expect(ret[0].post_id).toBe(-40);
    expect(ret[0].post_group).toBe(-40);
    expect(ret[0].posting_user).toBe(-40);
    expect(ret[0].caption).toBe('yup');
    expect(ret[0].audioUrl).toBe('url');
    expect(ret[0].posting_username).toBe('me');

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('add video post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    const post = await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const ret = await knex.select('*').from('post_lst').where('post_id', -40);

    expect(ret[0].post_id).toBe(-40);
    expect(ret[0].post_group).toBe(-40);
    expect(ret[0].posting_user).toBe(-40);
    expect(ret[0].caption).toBe('yup');
    expect(ret[0].videoUrl).toBe('url');
    expect(ret[0].posting_username).toBe('me');

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get user posts', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.getUserPosts(db, -40);

    expect(post[0].post_id).toBe(-40);
    expect(post[0].post_group).toBe(-40);
    expect(post[0].posting_user).toBe(-40);
    expect(post[0].caption).toBe('yup');
    expect(post[0].videoUrl).toBe('url');
    expect(post[0].posting_username).toBe('me');

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('flag post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.flagPost(db, -40, -40);
    const ret = await knex.select('*').from('post_lst').where('post_id', -40);
    const ret2 = await knex.select('*').from('post_flags').where('post_id', -40);

    expect(ret[0].is_flagged).toBe(1);
    expect(ret2[0].post_id).toBe(-40);
    expect(ret2[0].flagging_user).toBe(-40);

    await knex('post_flags').where('post_id', -40).del();
    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('is flagged post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.flagPost(db, -40, -40);
    const ret = await postLib.isFlagged(db, -40);

    expect(ret[0].post_id).toBe(-40);
    expect(ret[0].flagging_user).toBe(-40);

    await knex('post_flags').where('post_id', -40).del();
    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('remove post flag', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.flagPost(db, -40, -40);
    await postLib.removePostFlag(db, -40);
    const ret = await knex.select('*').from('post_flags').where('post_id', -40);
    expect(ret.length).toBe(0);

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('hide post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.hidePost(db, -40);
    const ret = await knex.select('*').from('post_lst').where('post_id', -40);

    expect(ret[0].is_hidden).toBe(1);

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('delete post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.deletePost(db, -40);
    const ret = await knex.select('*').from('post_lst').where('post_id', -40);

    expect(ret.length).toBe(0);

    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get posts by group id', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.getPosts(db, -40);

    expect(post[0][0].post_id).toBe(-40);
    expect(post[0][0].post_group).toBe(-40);
    expect(post[0][0].posting_user).toBe(-40);
    expect(post[0][0].caption).toBe('yup');
    expect(post[0][0].videoUrl).toBe('url');
    expect(post[0][0].posting_username).toBe('me');

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get posts by post id', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await postLib.addVideoPost(db, {
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const post = await postLib.getPostById(db, -40);

    expect(post[0][0].post_id).toBe(-40);
    expect(post[0][0].post_group).toBe(-40);
    expect(post[0][0].posting_user).toBe(-40);
    expect(post[0][0].caption).toBe('yup');
    expect(post[0][0].videoUrl).toBe('url');
    expect(post[0][0].posting_username).toBe('me');

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get next id posts', async () => {
    const id = await postLib.getNextId(db);
    expect(typeof id).toBe('number');
  });

  test('get post analytics facts', async () => {
    const facts = await postLib.getPostAnalyticsFacts(db);
    expect(facts.length).toBe(4);
    expect(typeof facts[0]).toBe('object');
    expect(typeof facts[1]).toBe('object');
    expect(typeof facts[2]).toBe('object');
    expect(typeof facts[3]).toBe('object');
  });

  test('add profile', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    const profile = await profileLib.addProfile(db, {
      user_id: -40, first_name: 'your', last_name: 'mom', biography: 'hi', profile_picture_url: 'url',
    });
    const ret = await knex.select('*').from('profile_lst').where('user_id', -40);

    expect(ret[0].user_id).toBe(-40);
    expect(ret[0].first_name).toBe('your');
    expect(ret[0].last_name).toBe('mom');
    expect(ret[0].biography).toBe('hi');
    expect(ret[0].profile_picture_url).toBe('url');

    await knex('profile_lst').where('user_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get profile by id', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    const profile = await profileLib.addProfile(db, {
      user_id: -40, first_name: 'your', last_name: 'mom', biography: 'hi', profile_picture_url: 'url',
    });
    const ret = await profileLib.getProfileById(db, -40);

    expect(ret[0][0].user_id).toBe(-40);
    expect(ret[0][0].first_name).toBe('your');
    expect(ret[0][0].last_name).toBe('mom');
    expect(ret[0][0].biography).toBe('hi');
    expect(ret[0][0].profile_picture_url).toBe('url');

    await knex('profile_lst').where('user_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get profiles', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    const profile = await profileLib.addProfile(db, {
      user_id: -40, first_name: 'your', last_name: 'mom', biography: 'hi', profile_picture_url: 'url',
    });
    const ret = await profileLib.getProfiles(db);

    expect(ret[0].length > 1).toBe(true);

    await knex('profile_lst').where('user_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('delete profile by id', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    const profile = await profileLib.addProfile(db, {
      user_id: -40, first_name: 'your', last_name: 'mom', biography: 'hi', profile_picture_url: 'url',
    });
    const ret = await profileLib.deleteProfile(db, -40);
    const ret2 = await knex.select('*').from('profile_lst').where('user_id', -40);

    expect(ret2.length).toBe(0);

    await knex('user_lst').where('user_id', -40).del();
  });

  test('delete2 profile by id', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    const profile = await profileLib.addProfile(db, {
      user_id: -40, first_name: 'your', last_name: 'mom', biography: 'hi', profile_picture_url: 'url',
    });
    const ret = await profileLib.deleteProfile2(db, -40);
    const ret2 = await knex.select('*').from('profile_lst').where('user_id', -40);

    expect(ret2.length).toBe(0);

    await knex('user_lst').where('user_id', -40).del();
  });

  test('update profile', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    const profile = await profileLib.addProfile(db, {
      user_id: -40, first_name: 'your', last_name: 'mom', biography: 'hi', profile_picture_url: 'url',
    });
    const profile2 = await profileLib.updateProfile(db, -40, 'waddup');
    const ret = await knex.select('*').from('profile_lst').where('user_id', -40);

    expect(ret[0].user_id).toBe(-40);
    expect(ret[0].first_name).toBe('your');
    expect(ret[0].last_name).toBe('mom');
    expect(ret[0].biography).toBe('waddup');
    expect(ret[0].profile_picture_url).toBe('url');

    await knex('profile_lst').where('user_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('update profile pic', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    const profile = await profileLib.addProfile(db, {
      user_id: -40, first_name: 'your', last_name: 'mom', biography: 'hi', profile_picture_url: 'url',
    });
    const profile2 = await profileLib.updateProfilePic(db, -40, 'new url');
    const ret = await knex.select('*').from('profile_lst').where('user_id', -40);

    expect(ret[0].user_id).toBe(-40);
    expect(ret[0].first_name).toBe('your');
    expect(ret[0].last_name).toBe('mom');
    expect(ret[0].biography).toBe('hi');
    expect(ret[0].profile_picture_url).toBe('new url');

    await knex('profile_lst').where('user_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('add reply to post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await knex('post_lst').insert({
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const rep = await replyLib.addReply(db, {
      reply_id: -40, post_id: -40, post_group: -40, posting_user: -40, caption: 'yo',
    });
    const ret = await knex.select('*').from('reply_lst').where('reply_id', -40);

    expect(ret[0].post_id).toBe(-40);
    expect(ret[0].post_group).toBe(-40);
    expect(ret[0].posting_user).toBe(-40);
    expect(ret[0].caption).toBe('yo');

    await knex('reply_lst').where('post_id', -40).del();
    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('flag reply on post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await knex('post_lst').insert({
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const rep = await replyLib.addReply(db, {
      reply_id: -40, post_id: -40, post_group: -40, posting_user: -40, caption: 'yo',
    });
    const rep2 = await replyLib.flagReply(db, -40);
    const ret = await knex.select('*').from('reply_lst').where('reply_id', -40);

    expect(ret[0].is_flagged).toBe(1);

    await knex('reply_lst').where('post_id', -40).del();
    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('hide reply on post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await knex('post_lst').insert({
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const rep = await replyLib.addReply(db, {
      reply_id: -40, post_id: -40, post_group: -40, posting_user: -40, caption: 'yo',
    });
    const rep2 = await replyLib.hideReply(db, -40);
    const ret = await knex.select('*').from('reply_lst').where('reply_id', -40);

    expect(ret[0].is_hidden).toBe(1);

    await knex('reply_lst').where('post_id', -40).del();
    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('delete reply on post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await knex('post_lst').insert({
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const rep = await replyLib.addReply(db, {
      reply_id: -40, post_id: -40, post_group: -40, posting_user: -40, caption: 'yo',
    });
    const rep2 = await replyLib.deleteReply(db, -40);
    const ret = await knex.select('*').from('reply_lst').where('reply_id', -40);

    expect(ret.length).toBe(0);

    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('edit reply on post', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await knex('post_lst').insert({
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const rep = await replyLib.addReply(db, {
      reply_id: -40, post_id: -40, post_group: -40, posting_user: -40, caption: 'yo',
    });
    const rep2 = await replyLib.editReply(db, -40, 'new');
    const ret = await knex.select('*').from('reply_lst').where('reply_id', -40);

    expect(ret[0].caption).toBe('new');

    await knex('reply_lst').where('post_id', -40).del();
    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get reply post group is id', async () => {
    await knex('user_lst').insert({ user_id: -40, user_name: 'me', user_password: 'password' });
    await knex('group_lst').insert({
      group_id: -40, group_name: 'group', group_creator: -40, group_description: 'description', is_public: 1,
    });
    await knex('post_lst').insert({
      post_id: -40, post_group: -40, posting_user: -40, caption: 'yup', videoUrl: 'url', posting_username: 'me',
    });
    const rep = await replyLib.addReply(db, {
      reply_id: -40, post_id: -40, post_group: -40, posting_user: -40, caption: 'yo',
    });
    const ret = await replyLib.getReplies(db, -40);

    expect(ret[0][0].post_id).toBe(-40);
    expect(ret[0][0].post_group).toBe(-40);
    expect(ret[0][0].posting_user).toBe(-40);
    expect(ret[0][0].caption).toBe('yo');

    await knex('reply_lst').where('post_id', -40).del();
    await knex('post_lst').where('post_id', -40).del();
    await knex('group_lst').where('group_id', -40).del();
    await knex('user_lst').where('user_id', -40).del();
  });

  test('get next id for post reply', async () => {
    const id = await replyLib.getNextId(db);
    expect(typeof id).toBe('number');
  });

  test('add user success', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const ret = await knex.select('*').from('user_lst').where('user_id', -50);

    expect(ret[0].user_id).toBe(-50);
    expect(ret[0].user_name).toBe('yo');
    expect(ret[0].user_password).toBe('secret');

    await knex('user_lst').where('user_id', -40).del();
  });

  test('add user already exists', async () => {
    const user = await userLib.addUser(db, { user_id: -60, user_name: 'interesting', user_password: 'secret' });
    const user2 = await userLib.addUser(db, { user_id: -70, user_name: 'interesting', user_password: 'secret' });
    const ret = await knex.select('*').from('user_lst').where('user_id', -60);

    expect(ret[0].user_id).toBe(-60);
    expect(ret[0].user_name).toBe('interesting');
    expect(ret[0].user_password).toBe('secret');
    expect(user2).toBe(null);

    await knex('user_lst').where('user_id', -60).del();
  });

  test('get all users', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const users = await userLib.getUsers(db);

    expect(users[0].length > 1).toBe(true);

    await knex('user_lst').where('user_id', -50).del();
  });

  test('get user by id', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const ret = await userLib.getUserById(db, -50);

    expect(ret[0].user_id).toBe(-50);
    expect(ret[0].user_name).toBe('yo');
    expect(ret[0].user_password).toBe('secret');

    await knex('user_lst').where('user_id', -50).del();
  });

  test('get user by name', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const ret = await userLib.getUsersWithName(db, 'yo');

    expect(ret[0].user_id).toBe(-50);
    expect(ret[0].user_name).toBe('yo');
    expect(ret[0].user_password).toBe('secret');

    await knex('user_lst').where('user_id', -50).del();
  });

  test('delete user', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const res = await userLib.deleteUser(db, -50);
    const ret = await knex.select('*').from('user_lst').where('user_id', -50);

    expect(ret.length).toBe(0);
  });

  test('update a user password', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const res = await userLib.updateUser(db, -50, '', 'new');
    const ret = await knex.select('*').from('user_lst').where('user_id', -50);

    expect(ret[0].user_id).toBe(-50);
    expect(ret[0].user_name).toBe('yo');
    expect(ret[0].user_password).toBe('new');

    await knex('user_lst').where('user_id', -50).del();
  });

  test('get next id for user', async () => {
    const id = await userLib.getNextId(db);
    expect(typeof id).toBe('number');
  });

  test('lockout a user', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const res = await userLib.lockoutUser(db, -50);
    const ret = await knex.select('*').from('user_lst').where('user_id', -50);

    expect(ret[0].locked_out === null).toBe(false);

    await knex('user_lst').where('user_id', -50).del();
  });

  test('unlock a user', async () => {
    const user = await userLib.addUser(db, { user_id: -50, user_name: 'yo', user_password: 'secret' });
    const res = await userLib.lockoutUser(db, -50);
    const res2 = await userLib.unlockUser(db, -50);
    const ret = await knex.select('*').from('user_lst').where('user_id', -50);

    expect(ret[0].locked_out === null).toBe(true);

    await knex('user_lst').where('user_id', -50).del();
  });
});
