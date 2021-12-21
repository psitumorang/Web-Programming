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

const request = require('supertest');
const userLib = require('../../userTableDatabase');
const profileLib = require('../../profileTableDatabase');
const postLib = require('../../postTableDatabase');
const groupLib = require('../../groupTableDatabase');
const notifLib = require('../../notificationTableDatabase');
const adminLib = require('../../adminTableDatabase');
const replyLib = require('../../replyTableDatabase');
const inviteLib = require('../../invitationTableDatabase');
const groupMemberLib = require('../../groupMemberTableDatabase');
const msgLib = require('../../messageTableDatabase');
const convoLib = require('../../convoTableDatabase');

const webapp = require('../../server');

let userDb;
let profileDb;
let postDb;
let groupDb;
let notifDb;
let adminDb;
let replyDb;
let inviteDb;
let groupMemberDb;
let msgDb;
let convoDb;

describe('Test webapp endpoints and integration tests', () => {
  beforeAll(async () => {
    userDb = await userLib.connect();
    profileDb = await profileLib.connect();
    postDb = await postLib.connect();
    groupDb = await groupLib.connect();
    notifDb = await notifLib.connect();
    adminDb = await adminLib.connect();
    replyDb = await replyLib.connect();
    inviteDb = await inviteLib.connect();
    groupMemberDb = await groupMemberLib.connect();
    msgDb = await msgLib.connect();
    convoDb = await convoLib.connect();
  });

  test('status code and response successful registration endpoint', async () => {
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const user = await knex.select('*').from('user_lst').where('user_name', '=', 'mcleesm');
    expect(user[0].user_name).toBe('mcleesm');
    const ret = JSON.parse(response.text);
    expect(ret.user.user_name).toBe('mcleesm');
    expect(ret.profile.user_id).toBe(user[0].user_id);
    const response2 = await request(webapp).get('/user-by-name/mcleesm');
    expect(response2.status).toBe(200);
    await knex('profile_lst').where('user_id', user[0].user_id).del();
    await knex('user_lst').where('user_name', 'mcleesm').del();
  });

  test('status code and response unsuccessful registration endpoint', async () => {
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm1',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const user = await knex.select('*').from('user_lst').where('user_name', '=', 'mcleesm1');
    const response2 = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm1',
        user_password: 'verysecret',
      });
    expect(response2.status).toBe(400);
    const ret = JSON.parse(response2.text);
    expect(ret.err).toBe('username already taken');
    await knex('profile_lst').where('user_id', user[0].user_id).del();
    await knex('user_lst').where('user_name', 'mcleesm1').del();
  });

  test('status code and response successful login', async () => {
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm2',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const body = {
      user_name: 'mcleesm2',
      user_password: 'verysecret',
      attempt: 0,
    };
    const user = await knex.select('*').from('user_lst').where('user_name', '=', 'mcleesm2');
    const response2 = await request(webapp).post('/login')
      .send(body);
    expect(response2.status).toBe(200);
    await knex('profile_lst').where('user_id', user[0].user_id).del();
    await knex('user_lst').where('user_name', 'mcleesm2').del();
  });

  test('status code and response unsuccessful login - user does not exist', async () => {
    const body = {
      user_name: 'doesntexist',
      user_password: 'thisisapassword',
      attempt: 0,
    };
    const response = await request(webapp).post('/login')
      .send(body);
    expect(response.status).toBe(404);
  });

  test('status code and response unsuccessful login - attempt 3', async () => {
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm3',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const body = {
      user_name: 'mcleesm3',
      user_password: 'verysecret',
      attempt: 3,
    };
    const user = await knex.select('*').from('user_lst').where('user_name', '=', 'mcleesm3');
    const response2 = await request(webapp).post('/login')
      .send(body);
    expect(response2.status).toBe(404);
    await knex('profile_lst').where('user_id', user[0].user_id).del();
    await knex('user_lst').where('user_name', 'mcleesm3').del();
  });

  test('status code and response unsuccessful login - incorrect password', async () => {
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm4',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const body = {
      user_name: 'mcleesm4',
      user_password: 'wrong',
      attempt: 3,
    };
    const user = await knex.select('*').from('user_lst').where('user_name', '=', 'mcleesm4');
    const response2 = await request(webapp).post('/login')
      .send(body)
      .expect(404);
    expect(response2.status).toBe(404);
    await knex('profile_lst').where('user_id', user[0].user_id).del();
    await knex('user_lst').where('user_name', 'mcleesm4').del();
  });

  test('status code and response get and delete profile', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    const userId = ret.user.user_id;

    const response2 = await request(webapp).get(`/profile/${userId}`);
    expect(response2.status).toBe(200);

    const response3 = await request(webapp).delete(`/profile/${userId}`);
    expect(response3.status).toBe(200);

    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('status code and response creating text post', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/text')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', posting_username: 'mcleesm',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    // get the post from the user id
    const response4 = await request(webapp).get(`/post/${userId}`);
    expect(response4.status).toBe(200);
    const ret4 = JSON.parse(response4.text);
    expect(ret4[0].caption).toBe('its a post');
    expect(ret4[0].post_id).toBe(ret3.post.post_id);
    await knex('post_lst').where('post_id', ret3.post.post_id).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('status code and response creating video post', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/video')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', videoUrl: 'wow it has video', posting_username: 'mcleesm',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    // get the post from the user id
    const response4 = await request(webapp).get(`/post/${userId}`);
    expect(response4.status).toBe(200);
    const ret4 = JSON.parse(response4.text);
    expect(ret4[0].caption).toBe('its a post');
    expect(ret4[0].post_id).toBe(ret3.post.post_id);
    await knex('post_lst').where('post_id', ret3.post.post_id).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('status code and response creating audio post', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/audio')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', audioUrl: 'wow it has audio', posting_username: 'mcleesm',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    // get the post from the user id
    const response4 = await request(webapp).get(`/post/${userId}`);
    expect(response4.status).toBe(200);
    const ret4 = JSON.parse(response4.text);
    expect(ret4[0].caption).toBe('its a post');
    expect(ret4[0].post_id).toBe(ret3.post.post_id);
    await knex('post_lst').where('post_id', ret3.post.post_id).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('status code and response creating image post', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/image')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', photourl: 'wow it has photos', posting_username: 'mcleesm',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    // get the post from the user id
    const response4 = await request(webapp).get(`/post/${userId}`);
    expect(response4.status).toBe(200);
    const ret4 = JSON.parse(response4.text);
    expect(ret4[0].caption).toBe('its a post');
    expect(ret4[0].post_id).toBe(ret3.post.post_id);
    await knex('post_lst').where('post_id', ret3.post.post_id).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('status code and response group topics', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1, topic_1: 'topic1', topic_2: 'topic2', topic_3: 'topic3',
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;

    // get topics sorted
    const response3 = await request(webapp).get('/topics/topic1/none');
    expect(response3.status).toBe(200);

    // get all topics
    const response4 = await request(webapp).get('/topics');
    expect(response4.status).toBe(200);

    await knex('group_topics').where('group_id', groupId).del();
    await knex('group_topics').where('group_id', groupId).del();
    await knex('group_topics').where('group_id', groupId).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('status code and response creating text messages and convos', async () => {
    // create user1
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    const userId1 = ret.user.user_id;
    // create user2
    const response2 = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm1',
        user_password: 'verysecret',
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const userId2 = ret2.user.user_id;

    // create group
    const response3 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId1, group_description: 'its a group', is_public: 1,
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    const groupId = ret3.group.group_id;

    const response7 = await request(webapp).post(`/membership/${groupId}`)
      .send({ id: userId2 });
    expect(response7.status).toBe(200);

    // put them as admins
    const response4 = await request(webapp).post('/admins')
      .send({ admin: { groupId, isCreator: 0, adminUser: 'mcleesm1' } });
    expect(response4.status).toBe(201);

    // create conversation
    // send a text message
    const response5 = await request(webapp).post(`/message/text/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', txt: 'hi bro',
        },
      });
    expect(response5.status).toBe(201);

    // get conversation so we can see the convo id (for deleting)
    const response6 = await request(webapp).get(`/convo/${userId1}`);
    expect(response6.status).toBe(200);
    const { convoId } = JSON.parse(response6.text)[0];
    // send a video message
    const response8 = await request(webapp).post(`/message/video/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', video: 'omg a url',
        },
      });
    expect(response8.status).toBe(201);

    // send an audio message
    const response9 = await request(webapp).post(`/message/audio/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', audio: 'omg a url',
        },
      });
    expect(response9.status).toBe(201);

    // send an image message
    const response10 = await request(webapp).post(`/message/image/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', img: 'omg a url',
        },
      });
    expect(response10.status).toBe(201);

    await knex('msg_lst').where('convoId', convoId).del();
    await knex('convo_lst').where('convoId', convoId).del();
    await knex('group_members').where('member_id', userId1).del();
    await knex('group_members').where('member_id', userId2).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId1).del();
    await knex('profile_lst').where('user_id', userId2).del();
    await knex('user_lst').where('user_name', 'mcleesm').del();
    await knex('user_lst').where('user_name', 'mcleesm1').del();
  });

  test('create and flag a post, post gets deleted', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/image')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', photourl: 'wow it has photos', posting_username: 'mcleesm5',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    const postId = ret3.post.post_id;

    // flag the post
    const response5 = await request(webapp).put(`/flag-post/${postId}`)
      .send({
        flaggerId: userId, flaggerName: 'mcleesm5', groupId, groupName: 'test',
      });
    expect(response5.status).toBe(201);

    // get flagged post for user with id
    const response6 = await request(webapp).get(`/flag-post/${userId}`);
    expect(response6.status).toBe(200);

    // delete flagged post
    const response7 = await request(webapp).delete(`/flag-post/${postId}`)
      .send({
        flaggerId: userId, flaggerName: 'mcleesm5', groupId, deleted: 1, author: 'mcleesm5',
      });
    expect(response7.status).toBe(200);

    await knex('group_members').where('member_id', userId).del();
    await knex('post_lst').where('post_id', postId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('status code and response creating text messages and convos', async () => {
    // create user1
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    const userId1 = ret.user.user_id;
    // create user2
    const response2 = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm1',
        user_password: 'verysecret',
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const userId2 = ret2.user.user_id;

    // create group
    const response3 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId1, group_description: 'its a group', is_public: 1,
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    const groupId = ret3.group.group_id;

    const response7 = await request(webapp).post(`/membership/${groupId}`)
      .send({ id: userId2 });
    expect(response7.status).toBe(200);

    // put them as admins
    const response4 = await request(webapp).post('/admins')
      .send({ admin: { groupId, isCreator: 0, adminUser: 'mcleesm1' } });
    expect(response4.status).toBe(201);

    // create conversation
    // send a text message
    const response5 = await request(webapp).post(`/message/text/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', txt: 'hi bro',
        },
      });
    expect(response5.status).toBe(201);

    // get conversation so we can see the convo id (for deleting)
    const response6 = await request(webapp).get(`/convo/${userId1}`);
    expect(response6.status).toBe(200);
    const { convoId } = JSON.parse(response6.text)[0];
    // send a video message
    const response8 = await request(webapp).post(`/message/video/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', video: 'omg a url',
        },
      });
    expect(response8.status).toBe(201);

    // send an audio message
    const response9 = await request(webapp).post(`/message/audio/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', audio: 'omg a url',
        },
      });
    expect(response9.status).toBe(201);

    // send an image message
    const response10 = await request(webapp).post(`/message/image/${userId2}`)
      .send({
        msg: {
          toId: userId2, fromId: userId1, senderName: 'mcleesm', receiverName: 'mcleesm1', img: 'omg a url',
        },
      });
    expect(response10.status).toBe(201);

    await knex('msg_lst').where('convoId', convoId).del();
    await knex('convo_lst').where('convoId', convoId).del();
    await knex('group_members').where('member_id', userId1).del();
    await knex('group_members').where('member_id', userId2).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId1).del();
    await knex('profile_lst').where('user_id', userId2).del();
    await knex('user_lst').where('user_name', 'mcleesm').del();
    await knex('user_lst').where('user_name', 'mcleesm1').del();
  });

  test('create and flag a post, post doesnt get deleted', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/image')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', photourl: 'wow it has photos', posting_username: 'mcleesm5',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    const postId = ret3.post.post_id;

    // flag the post
    const response5 = await request(webapp).put(`/flag-post/${postId}`)
      .send({
        flaggerId: userId, flaggerName: 'mcleesm5', groupId, groupName: 'test',
      });
    expect(response5.status).toBe(201);

    // get flagged post for user with id
    const response6 = await request(webapp).get(`/flag-post/${userId}`);
    expect(response6.status).toBe(200);

    // delete flagged post
    const response7 = await request(webapp).delete(`/flag-post/${postId}`)
      .send({
        flaggerId: userId, flaggerName: 'mcleesm5', groupId, deleted: 0, author: 'mcleesm5',
      });
    expect(response7.status).toBe(200);

    await knex('post_lst').where('post_id', postId).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('post_flags').where('post_id', postId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('create and hide a post then delete it', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/image')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', photourl: 'wow it has photos', posting_username: 'mcleesm5',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);
    const postId = ret3.post.post_id;

    // hide the post
    const response5 = await request(webapp).put(`/hide-post/${postId}`);
    expect(response5.status).toBe(201);

    const response7 = await request(webapp).get(`/posts/${groupId}`);
    expect(response7.status).toBe(200);

    // delete hidden post with post id
    const response6 = await request(webapp).delete(`/post/${postId}`);
    expect(response6.status).toBe(201);

    await knex('group_members').where('member_id', userId).del();
    await knex('post_flags').where('post_id', postId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('test analytics groups route', async () => {
    const response = await request(webapp).get('/analytics-groups');
    expect(response.status).toBe(200);
  });

  test('test analytics posts route', async () => {
    const response = await request(webapp).get('/analytics-posts');
    expect(response.status).toBe(200);
  });

  test('add comments to post, then hide them', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/image')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', photourl: 'wow it has photos', posting_username: 'mcleesm',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);

    // get the post from the user id
    const response4 = await request(webapp).get(`/post/${userId}`);
    expect(response4.status).toBe(200);
    const ret4 = JSON.parse(response4.text);
    expect(ret4[0].caption).toBe('its a post');
    expect(ret4[0].post_id).toBe(ret3.post.post_id);
    const postId = ret3.post.post_id;

    // add a comment
    const response5 = await request(webapp).post('/reply')
      .send({
        post_id: postId, post_group: groupId, posting_user: userId, caption: 'woah',
      });
    expect(response5.status).toBe(201);
    const ret5 = JSON.parse(response5.text);
    const replyId = ret5.reply.reply_id;

    // get all comments for post
    const response6 = await request(webapp).get(`/replies/${groupId}`);
    expect(response6.status).toBe(200);

    // hide the comment
    const response7 = await request(webapp).put(`/hide-reply/${replyId}`);
    expect(response7.status).toBe(201);

    // delete the comment
    const response8 = await request(webapp).delete(`/reply/${replyId}`);
    expect(response8.status).toBe(201);

    await knex('post_lst').where('post_id', ret3.post.post_id).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });

  test('add comments to post, edit, and then flag them', async () => {
    // create user
    const response = await request(webapp).post('/registration')
      .send({
        user_name: 'mcleesm5',
        user_password: 'verysecret',
      });
    expect(response.status).toBe(201);
    const ret = JSON.parse(response.text);
    // create group
    const userId = ret.user.user_id;
    const response2 = await request(webapp).post('/groups')
      .send({
        group_name: 'test', group_creator: userId, group_description: 'its a group', is_public: 1,
      });
    expect(response2.status).toBe(201);
    const ret2 = JSON.parse(response2.text);
    const groupId = ret2.group.group_id;
    // create a post
    const response3 = await request(webapp).post('/post/image')
      .send({
        post_group: groupId, posting_user: userId, caption: 'its a post', photourl: 'wow it has photos', posting_username: 'mcleesm',
      });
    expect(response3.status).toBe(201);
    const ret3 = JSON.parse(response3.text);

    // get the post from the user id
    const response4 = await request(webapp).get(`/post/${userId}`);
    expect(response4.status).toBe(200);
    const ret4 = JSON.parse(response4.text);
    expect(ret4[0].caption).toBe('its a post');
    expect(ret4[0].post_id).toBe(ret3.post.post_id);
    const postId = ret3.post.post_id;

    // add a comment
    const response5 = await request(webapp).post('/reply')
      .send({
        post_id: postId, post_group: groupId, posting_user: userId, caption: 'woah',
      });
    expect(response5.status).toBe(201);
    const ret5 = JSON.parse(response5.text);
    const replyId = ret5.reply.reply_id;

    // get all comments for post
    const response6 = await request(webapp).get(`/replies/${groupId}`);
    expect(response6.status).toBe(200);

    // edit the comment
    const response7 = await request(webapp).post(`/reply/${replyId}`)
      .send({ caption: 'it changed' });
    expect(response7.status).toBe(200);

    // flag the comment
    const response8 = await request(webapp).put(`/flag-reply/${replyId}`);
    expect(response8.status).toBe(201);

    await knex('reply_lst').where('reply_id', replyId).del();
    await knex('post_lst').where('post_id', ret3.post.post_id).del();
    await knex('group_members').where('member_id', userId).del();
    await knex('admin_lst').where('group_id', groupId).del();
    await knex('group_lst').where('group_id', groupId).del();
    await knex('profile_lst').where('user_id', userId).del();
    await knex('user_lst').where('user_name', 'mcleesm5').del();
  });
});
