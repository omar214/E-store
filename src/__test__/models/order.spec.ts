import orderModel from '../../models/orderModel';
import userModel from '../../models/userModel';
import productModel from '../../models/productModel';
import IOrder from '../../types/order';
import IUser from '../../types/user';
import IProduct from '../../types/product';
import db from '../../database';

describe('Order model', () => {
	const user1: IUser = {
		email: 'omar@gmail',
		first_name: 'omar',
		last_name: 'mohamed',
		password: 'omar123',
	};
	const product1: IProduct = {
		name: 'milk',
		price: 30,
	};
	const product2: IProduct = {
		name: 'chocolate',
		price: 50,
	};
	beforeAll(async () => {
		const createdUser = await userModel.addUser(user1);
		user1.id = createdUser.id;

		let res = await productModel.addProduct(product1);
		product1.id = res.id;

		res = await productModel.addProduct(product2);
		product2.id = res.id;
		console.log('before all done');
	});
	afterAll(async () => {
		const connection = await db.connect();
		const sql = `DELETE FROM orders; 
        ALTER SEQUENCE orders_id_seq RESTART WITH 1; 
				DELETE FROM products; 
        ALTER SEQUENCE products_id_seq RESTART WITH 1; 
        DELETE from users; 
        ALTER SEQUENCE users_id_seq RESTART WITH 1; 
      `;
		await connection.query(sql);
		connection.release();
	});
	let order1: IOrder, order2: IOrder;

	it('should create orders', async () => {
		order1 = {
			userId: user1.id,
			status: 'open',
		};
		order2 = {
			userId: user1.id,
			status: 'complete',
		};

		let orderRes = await orderModel.addOrder(order1);
		order1.id = orderRes.id;
		expect(orderRes.status).toBe(order1.status);

		orderRes = await orderModel.addOrder(order2);
		order2.id = orderRes.id;
		expect(orderRes.status).toBe(order2.status);
		// expect(orderRes.userId).toBe(order2.userId);
	});

	it('should get order by id', async () => {
		let res = await orderModel.getOrderById(order1.id as number);

		expect(res.status).toBe(order1.status);
	});

	it('should get all orders', async () => {
		let res = await orderModel.getAllOrders();

		expect(res.length).toBe(2);
	});
	it('should add order products', async () => {
		let quantity1 = 3,
			quantity2 = 5;
		let ord_products = [
			{ orderId: order1.id, product_id: product1.id, quantity: quantity1 },
			{ orderId: order1.id, product_id: product2.id, quantity: quantity2 },
		];
		await orderModel.addOrderProducts(ord_products, order1.id as number);

		let res = await orderModel.getUserOrders(order1.userId as number);
		expect(res.length).toBe(2);
	});

	it('should get user orders', async () => {
		let res = await orderModel.getUserOrders(order1.userId as number);

		expect(res.length).toBe(2);
	});

	it('should update order', async () => {
		order1.status = 'complete';
		let res = await orderModel.updateOder(order1);

		expect(res.status).toBe(order1.status);
	});

	it('should get user orders', async () => {
		let res = await orderModel.getUserOrders(order1.userId as number);

		expect(res.length).toBe(2);
	});

	it('should delete from orders', async () => {
		await orderModel.deleteOrder(order1.id as number);

		let res = await orderModel.getAllOrders();
		expect(res.length).toBe(1);
	});
});
