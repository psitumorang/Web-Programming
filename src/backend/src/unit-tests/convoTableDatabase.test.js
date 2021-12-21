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

const lib = require('../convoTableDatabase');
let db;

const clearDb = async (id) => {
	await knex('convo_lst').where('convoId', id).del();
};

describe('convo database operations tests', () => {
	beforeAll(async () => {
		db = await lib.connect();
	});

	test('add convo no error', async () => {
		const row = await lib.addConvo(db, -1, -2, 'me', 'them');
		const convo = await knex.select('*').from('convo_lst').where('convoId', row);

		expect(convo[0].user1).toBe(-1);
		expect(convo[0].user2).toBe(-2);
		expect(convo[0].user1Name).toBe('me');
		expect(convo[0].user2Name).toBe('them');
		expect(convo[0].convoId).toBe(row);
		clearDb(row);
	});

	test('convo exists', async () => {
		const row = await lib.addConvo(db, -1, -2, 'me', 'them');
		const exists = await lib.convoExists(db, -1, -2);
		const exists2 = await lib.convoExists(db, -2, -1);
		const exists3 = await lib.convoExists(db, -3, -4);
		expect(exists).toBe(true);
		expect(exists2).toBe(true);
		expect(exists3).toBe(false);
		clearDb(row);
	});

	test('get convo id', async () => {
		const row = await lib.addConvo(db, -1, -2, 'me', 'them');
		const convo = await knex.select('*').from('convo_lst').where('convoId', row);
		const id = await lib.getConvoId(db, -1, -2);
		const id2 = await lib.getConvoId(db, -2, -1);
		expect(convo[0].convoId).toBe(row);
		expect(id).toBe(row);
		expect(id2).toBe(row);
		clearDb(row);
	});

	test('get convos for user', async () => {
		const row = await lib.addConvo(db, -1, -2, 'me', 'them');
		const row2 = await lib.addConvo(db, -4, -1, 'they', 'me');
		const convo = await knex.select('*').from('convo_lst').where('user1', -1);
		const convo2 = await knex.select('*').from('convo_lst').where('user2', -1);
		const ret = await lib.getConvosForUser(db, -1);

		expect(convo[0].user1).toBe(-1);
		expect(convo2[0].user2).toBe(-1);
		expect(ret.length).toBe(2);
		
		expect(convo[0].convoId).toBe(row);
		clearDb(row);
		clearDb(row2);
	});
});
