import supertest from 'supertest';
import db from '../../database';
import IProduct from '../../types/product';
import IUser from '../../types/user';
import app from '../../server';

const request = supertest(app);
let token = '';

describe('product  Endpoints', () => {
	const user1: IUser = {
		email: 'test1@test.com',
		first_name: 'Test',
		last_name: 'User',
		password: 'test123',
	};
	const product1: IProduct = {
		name: 'chocolate',
		price: 50,
	};
	const product2: IProduct = {
		name: 'milk',
		price: 30,
	};
	const product3: IProduct = {
		name: 'cheese',
		price: 10,
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
	});
	afterAll(async () => {
		const connection = await db.connect();
		const sql = `DELETE FROM products;
      ALTER SEQUENCE products_id_seq RESTART WITH 1; 
      DELETE from users; 
      ALTER SEQUENCE users_id_seq RESTART WITH 1; 
    `;
		await connection.query(sql);
		connection.release();
	});

	describe('add product', () => {
		it('should add product correctly', async () => {
			let res = await request
				.post(`/api/products`)
				.set('Content-type', 'application/json')
				.set('Authorization', token)
				.send({
					name: product1.name,
					price: product1.price,
				});
			product1.id = res.body.product.id;

			expect(res.status).toBe(200);
			const { msg, product: resProduct } = res.body;
			expect(msg).toBe('product add');
			expect(resProduct.name).toBe(product1.name);
			expect(resProduct.price).toBe(product1.price);

			res = await request
				.post(`/api/products`)
				.set('Content-type', 'application/json')
				.set('Authorization', token)
				.send({
					name: product2.name,
					price: product2.price,
				});
			product2.id = res.body.product.id;

			res = await request
				.post(`/api/products`)
				.set('Content-type', 'application/json')
				.set('Authorization', token)
				.send({
					name: product3.name,
					price: product3.price,
				});
			product3.id = res.body.product.id;
		});

		it('should fail as missing parameter', async () => {
			const res = await request
				.post(`/api/products`)
				.set('Authorization', token)
				.set('Content-type', 'application/json')
				.send({
					name: product1.name,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe(
				'missing parameter price, name, price are required',
			);
		});

		it('should fail as product exits', async () => {
			const res = await request
				.post(`/api/products`)
				.set('Content-type', 'application/json')
				.set('Authorization', token)
				.send({
					name: product1.name,
					price: product1.price,
				});

			expect(res.status).toBe(409);
			expect(res.body.message).toBe('product already exists');
		});
	});
	describe('Get products', () => {
		it('should get all products', async () => {
			const res = await request
				.get(`/api/products`)
				.set('Content-type', 'application/json');

			expect(res.status).toBe(200);
			expect(res.body.products.length).toBe(3);
		});

		it('shoud get product by id', async () => {
			const res = await request
				.get(`/api/products/${product1.id}`)
				.set('Content-type', 'application/json');

			expect(res.status).toBe(200);
			const { product: resProduct } = res.body;
			expect(resProduct.name).toBe(product1.name);
			expect(resProduct.price).toBe(product1.price);
		});
	});
});
