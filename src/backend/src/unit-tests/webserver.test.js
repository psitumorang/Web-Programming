const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: 'database-1.cqgwv4rlupdn.us-east-2.rds.amazonaws.com',
		port: '3306',
		user: 'admin',
		password: 'staceyshapiro',
		database: 'db1',
	}
});

const userLib = require('../userTableDatabase');
const profileLib = require('../profileTableDatabase');
const postLib = require('../postTableDatabase');
const postCommentLib = require('../postCommentsTableDatabase');
const groupLib = require('../groupTableDatabase');
const notifLib = require('../notificationTableDatabase');
const adminLib = require('../adminTableDatabase');
const replyLib = require('../replyTableDatabase');
const inviteLib = require('../invitationTableDatabase');
const groupMemberLib = require('../groupMemberTableDatabase');
const msgLib = require('../messageTableDatabase');
const convoLib = require('../convoTableDatabase');

const request = require('supertest');
const webapp = require('../webserver');

const deleteUser = async (id) => {
  console.log('delete user');
  await knex('user_lst').where('user_id', id).del();
};

const deleteProfile = async (id) => {
  console.log('delete profile');
  await knex('profile_lst').where('user_id', id).del();
};

describe('Test webapp endpoints and integration tests', () => {
	const testUser = {
		user_name: 'mcleesm',
		user_password: 'verysecret',
	};

	beforeAll(async () => {
		db = await userLib.connect();
	});

	test('status code and response default response', () => request(webapp).get('/doesntexist')
	  .expect(404));

	test('status code and response successful registration endpoint', () => {
	  request(webapp).post('/registration')
	    .send(testUser)
	    .expect(201)
	    .then(async (response) => {
	  	  const user = await knex.select('*').from('user_lst').where('user_name', '=', testUser.user_name);
	  	  expect(user[0].user_name).toBe(testUser.user_name);
	  	  const ret = JSON.parse(response.text);
	  	  expect(ret.user.user_name).toBe(testUser.user_name);
	  	  expect(ret.profile.user_id).toBe(user[0].user_id);
	  	  await deleteProfile(user[0].user_id);
	  	  await deleteUser(user[0].user_id);
	   });
	 });

	test('status code and response unsuccessful registration endpoint', () => {
	  request(webapp).post('/registration')
	    .send(testUser)
	    .expect(201)
	    .then(async (response) => {
	      const user = await knex.select('*').from('user_lst').where('user_name', '=', testUser.user_name);
	      request(webapp).post('/registration')
	        .send(testUser)
	        .expect(400)
	        .then(async (responst) => {
	        	const ret = JSON.parse(response.text);
	        	expect(ret.err).toBe('username already taken');
	        	console.log('JUST ABOUT TO DELETE THIS GUY');
	        	await deleteProfile(user[0].user_id);
	        	await deleteUser(user[0].user_id);
	        	console.log('DELETED THIS GUY');
	        });
	   });
	});

	test('status code and response successful login', () => {
	  console.log('start login test');
	  request(webapp).post('/registration')
	    .send(testUser)
	    .expect(201)
	    .then(async () => {
	    	const body = {
	  	      ...testUser,
	  	      attempt: 0,
	  		};
	  		const user = await knex.select('*').from('user_lst').where('user_name', '=', testUser.user_name);
	  		const response = await request(webapp).post('/login')
	   		  .send(body)
	    	  .expect(200);
	  		await deleteProfile(user[0].user_id);
	  		await deleteUser(user[0].user_id);
	    });
	});

	test('status code and response unsuccessful login - user does not exist', () => {
    	const body = {
  	      ...testUser,
  	      attempt: 0,
  		};
  		const user = await knex.select('*').from('user_lst').where('user_name', '=', testUser.user_name);
  		const response = await request(webapp).post('/login')
   		  .send(body)
    	  .expect(404).then(() => {});
  		await deleteProfile(user[0].user_id);
  		await deleteUser(user[0].user_id);
	});

});
