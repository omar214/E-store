import supertest from 'supertest';
import db from '../../database';
import IProduct from '../../types/product';
import IOrder from '../../types/order';
import IUser from '../../types/user';
import app from '../../server';
import orderModel from '../../models/orderModel';

const request = supertest(app);
let token = '';

describe('order  Endpoints', () => {
	const user1: IUser = {
		email: 'test1@test.com',
		first_name: 'Test',
		last_name: 'User',
		password: 'test123',
	};

	beforeAll(async () => {
		// add user & gen token
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

		await orderModel.addOrder({
			userId: user1.id,
			status: 'open',
		});
		await orderModel.addOrder({
			userId: user1.id,
			status: 'complete',
		});
		await orderModel.addOrder({
			userId: user1.id,
			status: 'complete',
		});
	});
	afterAll(async () => {
		const connection = await db.connect();
		const sql = `DELETE FROM orders; 
      ALTER SEQUENCE orders_id_seq RESTART WITH 1; 
      DELETE from users; 
      ALTER SEQUENCE users_id_seq RESTART WITH 1; 
    `;
		await connection.query(sql);
		connection.release();
	});

	describe('should get all user orders', () => {
		it('should get all user orders correctly', async () => {
			let res = await request
				.get(`/api/orders`)
				.set('Content-type', 'application/json')
				.set('Authorization', token);

			const { orders: resOrders } = res.body;
			expect(res.status).toBe(200);

			expect(resOrders.length).toBe(3);
			expect(resOrders[0].userid).toBe(user1.id);
		});
		it('should get all complete oreders of user', async () => {
			let res = await request
				.get(`/api/orders/completed`)
				.set('Content-type', 'application/json')
				.set('Authorization', token);

			const { orders: resOrders } = res.body;
			expect(res.status).toBe(200);
			expect(resOrders.length).toBe(2);
			expect(resOrders[0].userid).toBe(user1.id);
		});
	});
});
