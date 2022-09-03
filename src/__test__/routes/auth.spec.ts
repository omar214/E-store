import supertest from 'supertest';
import db from '../../database';
import IUser from '../../types/user';
import app from '../../server';

const request = supertest(app);
let token = '';

describe('Auth  Endpoints', () => {
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

	afterAll(async () => {
		const connection = await db.connect();
		const sql = `DELETE FROM users; 
      ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
		await connection.query(sql);
		connection.release();
	});

	describe('Sign up', () => {
		it('should sign up correctly', async () => {
			const res = await request
				.post(`/api/auth/signup`)
				.set('Content-type', 'application/json')
				.send({
					email: user1.email,
					first_name: user1.first_name,
					last_name: user1.last_name,
					password: user1.password,
				});
			expect(res.status).toBe(200);
			const { msg, user: resUser, token: userToken } = res.body;
			expect(msg).toBe('sign up successful');
			expect(resUser.email).toBe(user1.email);
			token = userToken;
		});

		it('should fail as missing parameter', async () => {
			const res = await request
				.post(`/api/auth/signup`)
				.set('Content-type', 'application/json')
				.send({
					email: user1.email,
					first_name: user1.first_name,
					password: user1.password,
				});
			expect(res.status).toBe(400);
			expect(res.body.message).toBe(
				'missing parameter ; Email, first_name, last_name , and password are required',
			);
		});

		it('should fail as email exits', async () => {
			const res = await request
				.post(`/api/auth/signup`)
				.set('Content-type', 'application/json')
				.send({
					email: user1.email,
					first_name: user1.first_name,
					last_name: user1.last_name,
					password: user1.password,
				});

			expect(res.status).toBe(409);
			expect(res.body.message).toBe('User already exists');
		});
	});

	describe('log in', () => {
		it('should log in correctly', async () => {
			const res = await request
				.post(`/api/auth/login`)
				.set('Content-type', 'application/json')
				.send({
					email: user1.email,
					password: user1.password,
				});

			expect(res.status).toBe(200);
			const { msg, user: resUser, token: userToken } = res.body;
			expect(msg).toBe('Login successful');
			expect(resUser.email).toBe(user1.email);
			token = userToken;
		});

		it('should fail as missing parameter', async () => {
			const res = await request
				.post(`/api/auth/login`)
				.set('Content-type', 'application/json')
				.send({
					email: user1.email,
				});
			expect(res.status).toBe(400);
			expect(res.body.message).toBe('Email , and password are required');
		});

		it('should fail as email not exist', async () => {
			const res = await request
				.post(`/api/auth/login`)
				.set('Content-type', 'application/json')
				.send({
					email: 'unfound',
					password: user1.password,
				});

			expect(res.status).toBe(404);
			expect(res.body.message).toBe('User not found');
		});
	});
});
