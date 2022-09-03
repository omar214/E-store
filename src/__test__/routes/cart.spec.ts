import supertest from 'supertest';
import db from '../../database';
import IProduct from '../../types/product';
import ICart from '../../types/cart';
import IUser from '../../types/user';
import app from '../../server';

const request = supertest(app);
let token = '';

describe('Cart  Endpoints', () => {
	const user1: IUser = {
		email: 'test1@test.com',
		first_name: 'Test',
		last_name: 'User',
		password: 'test123',
	};
	let product1: IProduct = {
		name: 'chocolate',
		price: 50,
	};
	let product2: IProduct = {
		name: 'milk',
		price: 30,
	};
	let product3: IProduct = {
		name: 'cheese',
		price: 10,
	};
	let quantity1 = 2,
		quantity2 = 5,
		quantity3 = 9;

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

		// add products
		res = await request
			.post(`/api/products`)
			.set('Content-type', 'application/json')
			.set('Authorization', token)
			.send({
				name: product1.name,
				price: product1.price,
			});
		product1.id = res.body.product.id;

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
	afterAll(async () => {
		const connection = await db.connect();
		const sql = `DELETE FROM cart;
      DELETE FROM orders_products;
      DELETE FROM orders;
      ALTER SEQUENCE orders_id_seq RESTART WITH 1;
      DELETE FROM products;
      ALTER SEQUENCE products_id_seq RESTART WITH 1;
      DELETE from users;
      ALTER SEQUENCE users_id_seq RESTART WITH 1;
    `;
		await connection.query(sql);
		connection.release();
	});

		describe('should add products to cart', () => {
			it('should add product correctly', async () => {
				let res = await request
					.post(`/api/cart`)
					.set('Content-type', 'application/json')
					.set('Authorization', token)
					.send({
						product_id: product1.id,
						quantity: quantity1,
					});
				const { msg, product: resProduct } = res.body;
				expect(res.status).toBe(200);
				expect(msg).toBe('added to cart');
				expect(resProduct.cart_owner).toBe(user1.id);
				expect(resProduct.product_id).toBe(product1.id);
				expect(resProduct.quantity).toBe(quantity1);

				await request
					.post(`/api/cart`)
					.set('Content-type', 'application/json')
					.set('Authorization', token)
					.send({
						product_id: product2.id,
						quantity: quantity2,
					});
				await request
					.post(`/api/cart`)
					.set('Content-type', 'application/json')
					.set('Authorization', token)
					.send({
						product_id: product3.id,
						quantity: quantity3,
					});
			});
		});
		describe('should update products to cart', () => {
			it('should update product correctly', async () => {
				// update the values
				product1 = { name: 'chocolate', price: 99 };
				quantity1 = 123;

				let res = await request
					.patch(`/api/cart`)
					.set('Content-type', 'application/json')
					.set('Authorization', token)
					.send({
						product_id: product1.id,
						quantity: quantity1,
					});

				const { msg } = res.body;
				expect(res.status).toBe(200);
				expect(msg).toBe('product updated');
			});
		});
		describe('should get products to cart', () => {
			it('should get products correctly', async () => {
				let res = await request
					.get(`/api/cart`)
					.set('Content-type', 'application/json')
					.set('Authorization', token);

				const { cartProducts } = res.body;
				expect(res.status).toBe(200);
				expect(cartProducts.length).toBe(3);
			});
		});
		describe('should Checkout', () => {
			it('should Checkout correctly', async () => {
				let res = await request
					.post(`/api/cart/checkout`)
					.set('Content-type', 'application/json')
					.set('Authorization', token);

				const { msg } = res.body;
				expect(res.status).toBe(200);
				expect(msg).toBe('Check Out Done');
			});
		});
		describe('should delete product from cart', () => {
			it('should update product correctly', async () => {
				let res = await request
					.delete(`/api/cart`)
					.set('Content-type', 'application/json')
					.set('Authorization', token)
					.send({
						product_id: product1.id,
					});

				const { msg } = res.body;
				expect(res.status).toBe(200);
				expect(msg).toBe('product deleted from  to cart');
			});
		});
});
