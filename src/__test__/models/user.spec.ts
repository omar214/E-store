import userModel from '../../models/userModel';
import IUser from '../../types/user';

import db from '../../database';
afterAll(async () => {
	const connection = await db.connect();
	const sql = `DELETE FROM users; 
      ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
	await connection.query(sql);
	connection.release();
});
describe('User model', () => {
	const user1 = {
		email: 'omar@gmail',
		first_name: 'omar',
		last_name: 'mohamed',
		password: 'omar123',
	};
	const user2 = {
		email: 'mohamed@gmail',
		first_name: 'mohamed',
		last_name: 'ahmed',
		password: '123456',
	};
	let user1Response: IUser;
	let user2Response: IUser;
	it('create user', async () => {
		user1Response = await userModel.addUser(user1);
		user2Response = await userModel.addUser(user2);

		expect(user1Response.email).toBe(user1.email);
		expect(user1Response.first_name).toBe(user1.first_name);
		expect(user1Response.last_name).toBe(user1.last_name);
	});

	it('should get user By Id', async () => {
		let res = await userModel.getUserById(user1Response.id as number);

		expect(res.email).toBe(user1.email);
		expect(res.first_name).toBe(user1.first_name);
		expect(res.last_name).toBe(user1.last_name);
	});

	it('should get user By email', async () => {
		let res = await userModel.getUserByEmail(user1Response.email as string);

		expect(res.email).toBe(user1.email);
		expect(res.first_name).toBe(user1.first_name);
		expect(res.last_name).toBe(user1.last_name);
	});

	it('should get all users ', async () => {
		let res = await userModel.getAllUsers();
		// console.log(res);

		expect(res.length).toBe(2);
		expect(res[0].first_name).toBe(user1.first_name);
		expect(res[1].first_name).toBe(user2.first_name);
	});

	it('user shoud be authenticatd ', async () => {
		let isMatch = await userModel.authenticateUser(user1.email, user1.password);

		expect(isMatch).toBe(true);
	});

	it('user shoud not be authenticatd [WRONG PASS]', async () => {
		let isMatch = await userModel.authenticateUser(user1.email, 'wrong');

		expect(isMatch).toBe(false);
	});

	it('should delete user 1 ', async () => {
		await userModel.deleteUser(user1Response.id as number);
		let res = await userModel.getAllUsers();

		expect(res.length).toBe(1);
		expect(res[0].first_name).toBe(user2.first_name);
	});

	it('should delete user 2 ', async () => {
		await userModel.deleteUser(user2Response.id as number);
		let res = await userModel.getAllUsers();

		expect(res.length).toBe(0);
	});
});
