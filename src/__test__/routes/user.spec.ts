import supertest from 'supertest';
import db from '../../database';
import IUser from '../../types/user';
import app from '../../server';

const request = supertest(app);
let token = '';

describe('user  Endpoints', () => {
	const user1: IUser = {
		email: 'test1@test.com',
		first_name: 'Test',
		last_name: 'User',
		password: 'test123',
	};
	const user2: IUser = {
		email: 'test2@test.com',
		first_name: 'Test',
		last_name: 'User',
		password: 'test123',
	};
	const user3: IUser = {
		email: 'test3@test.com',
		first_name: 'Test',
		last_name: 'User',
		password: 'test123',
	};

	beforeAll(async () => {
		let res = await request
			.post(`/api/auth/signup`)
			.set('Content-type', 'application/json')
			.send({
				email: user1.email,
				first_name: user1.first_name,
				last_name: user1.last_name,
				password: user1.password,
			});
		user1.id = res.body.user.id;
		token = res.body.token;

		res = await request
			.post(`/api/auth/signup`)
			.set('Content-type', 'application/json')
			.send({
				email: user2.email,
				first_name: user2.first_name,
				last_name: user2.last_name,
				password: user2.password,
			});
		user2.id = res.body.user.id;

		res = await request
			.post(`/api/auth/signup`)
			.set('Content-type', 'application/json')
			.send({
				email: user3.email,
				first_name: user3.first_name,
				last_name: user3.last_name,
				password: user3.password,
			});
		user3.id = res.body.user.id;
	});
	afterAll(async () => {
		const connection = await db.connect();
		const sql = `DELETE FROM users; 
      ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
		await connection.query(sql);
		connection.release();
	});

	describe('get users', () => {
		it('should get 3 users', async () => {
			const res = await request
				.get(`/api/users`)
				.set('Content-type', 'application/json')
				.set('Authorization', token);

			expect(res.status).toBe(200);
			const { users } = res.body;
			expect(users.length).toBe(3);
		});

		it('should fail as no token', async () => {
			const res = await request
				.get(`/api/users`)
				.set('Content-type', 'application/json');

			expect(res.status).toBe(401);
			expect(res.body.message).toBe('No token provided');
		});

		it('should get user by id', async () => {
			const res = await request
				.get(`/api/users/${user1.id}`)
				.set('Content-type', 'application/json')
				.set('Authorization', token);

			expect(res.status).toBe(200);
			const { user: resUser } = res.body;
			expect(resUser.email).toBe(user1.email);
			expect(resUser.first_name).toBe(user1.first_name);
			expect(resUser.last_name).toBe(user1.last_name);
		});
	});
});
