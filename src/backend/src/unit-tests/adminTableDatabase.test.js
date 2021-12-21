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

const lib = require('../adminTableDatabase');
let db;

const clearDb = async (id) => {
	await knex('admin_lst').where('admin_id', id).del();
};

describe('admin database operations tests', () => {
	beforeAll(async () => {
		db = await lib.connect();
	});

	afterAll(async () => {
		await clearDb(-1);
	});

	test('test add admin for group success', async () => {
		const row = await lib.addAdminForGroup(db, -1, -1, 1, 'me');
		const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
		expect(newAdmin[0].admin_id).toBe(-1);
		expect(newAdmin[0].group_id).toBe(-1);
		expect(newAdmin[0].is_creator).toBe(1);
		expect(newAdmin[0].user_name).toBe('me');
	});

	test('test add admin for group unsuccessful', async () => {
		const row = await lib.addAdminForGroup(db, -1, -1, 1, 'me');
		const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
		expect(newAdmin[0].admin_id).toBe(-1);
		expect(newAdmin[0].group_id).toBe(-1);
		expect(newAdmin[0].is_creator).toBe(1);
		expect(newAdmin[0].user_name).toBe('me');
		const row1 = await lib.addAdminForGroup(db, -1, -1, 1, 'me');
		const newAdmin2 = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
		expect(row1).toBe(null);
		expect(newAdmin2.length).toBe(1);
	});

	test('test get admin for group success', async () => {
		const row = await lib.addAdminForGroup(db, -1, -1, 1, 'me');
		const groups = await lib.getAdmins(db, -1);
		const newGroups = await knex.select('*').from('admin_lst').where('group_id', '=', -1);
		expect(newGroups[0].admin_id).toBe(-1);
		expect(newGroups[0].group_id).toBe(-1);
		expect(newGroups[0].is_creator).toBe(1);
		expect(newGroups[0].user_name).toBe('me');
	});

	test('test get admin for group unsuccessful', async () => {
		const groups = await lib.getAdmins(db, -5);
		expect(groups).toStrictEqual([]);
	});

	test('test get all admins successful', async () => {
		await lib.addAdminForGroup(db, -1, -1, 1, 'me');
		await lib.addAdminForGroup(db, -2, -2, 1, 'you');
		await lib.addAdminForGroup(db, -3, -3, 1, 'them');
		const groups = await lib.getAllAdmins(db, -1);
		expect(groups["-1"].length >= 1).toBe(true);
		expect(groups["-2"].length >= 1).toBe(true);
		expect(groups["-3"].length >= 1).toBe(true);
		expect()
		await clearDb(-2);
		await clearDb(-3);
	});

	test('test get groups adminned by user successful', async () => {
		await lib.addAdminForGroup(db, -1, -1, 1, 'me');
		await lib.addAdminForGroup(db, -2, -1, 1, 'me');
		await lib.addAdminForGroup(db, -3, -1, 1, 'me');
		const groups = await lib.getAdministeredGroups(db, -1);
		expect(groups).toStrictEqual([{group_id: -3}, {group_id: -2}, {group_id:-1}]);
		const list = await knex.select('group_id').from('admin_lst').where('admin_id', '=', -1);
		expect(list[0].group_id).toBe(-3);
		expect(list[1].group_id).toBe(-2);
		expect(list[2].group_id).toBe(-1);
		await clearDb(-1);
		await clearDb(-1);
	});

	test('test revoke admin for group success', async () => {
		const row = await lib.addAdminForGroup(db, -1, -1, 0, 'me');
		const groups = await lib.revokeAdmin(db, -1, 'me');
		const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
		expect(newAdmin.length).toBe(0);
	});

	test('test revoke admin for group unsuccessful', async () => {
		const row = await lib.addAdminForGroup(db, -1, -1, 1, 'me');
		const groups = await lib.revokeAdmin(db, -1, 'me');
		expect(groups.err.message).toBe('admin is creator of group, cannot be revoked');
		const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
		expect(newAdmin[0].admin_id).toBe(-1);
		expect(newAdmin[0].group_id).toBe(-1);
		expect(newAdmin[0].is_creator).toBe(1);
		expect(newAdmin[0].user_name).toBe('me');
	});

	test('test delete admins', async () => {
		const row = await lib.addAdminForGroup(db, -1, -1, 0, 'me');
		const groups = await lib.deleteAdmins(db, -1);
		const newAdmin = await knex.select('*').from('admin_lst').where('admin_id', '=', -1);
		expect(newAdmin.length).toBe(0);
	});
});
