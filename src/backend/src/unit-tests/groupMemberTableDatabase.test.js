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
const groupLib = require('../groupTableDatabase');
const lib = require('../groupMemberTableDatabase');
let db;

const clearDb = async (id) => {
	await knex('group_members').where('group_id', id).del();
	await knex('group_lst').where('group_id', id).del();
	await knex('user_lst').where('user_id', id).del();
};

describe('group database operations tests', () => {
	beforeAll(async () => {
		db = await lib.connect();
	});

	// afterAll(async () => {
	// 	await clearDb(-1);
	// });

	test('add group member', async () => {
		await knex('user_lst').insert({user_id: -1, user_name: 'me', user_password: 'password'});
		await knex('group_lst').insert({group_id: -1, group_name: 'group', group_creator: -1, group_description: 'description', is_public: 1});
		const row = await lib.addGroupMember(db, -1, -1);
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
		await knex('user_lst').insert({user_id: -2, user_name: 'me', user_password: 'password'});
		await knex('user_lst').insert({user_id: -3, user_name: 'me', user_password: 'password'});
		await knex('group_lst').insert({group_id: -2, group_name: 'group', group_creator: -2, group_description: 'description', is_public: 1});
		await knex('group_members').insert({group_id: -2, member_id: -2});
		await knex('group_members').insert({group_id: -2, member_id: -3});
		const members = await lib.getMemberIds(db, -2);
		const convo = await knex.select('*').from('group_members').where('group_id', -2);
		console.log(members);
		expect(members[0]['member_id']).toBe(-1);
		expect(members[1]['member_id']).toBe(-2);
		await knex('group_members').where('group_id', -2).del();
		await knex('group_members').where('group_id', -3).del();
		await knex('group_lst').where('group_id', -2).del();
		await knex('user_lst').where('user_id', -2).del();
		await knex('user_lst').where('user_id', -3).del();
	});
});
