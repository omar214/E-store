import productModel from '../../models/productModel';
import IProduct from '../../types/product';

import db from '../../database';

describe('Product model', () => {
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
	const product1 = {
		name: 'milk',
		price: 30,
	};
	const product2 = {
		name: 'chocolate',
		price: 50,
	};
	let product1Response: IProduct;
	let product2Response: IProduct;
	it('create product', async () => {
		product1Response = await productModel.addProduct(product1);
		product2Response = await productModel.addProduct(product2);

		expect(product1Response.name).toBe(product1.name);
		expect(product1Response.price).toBe(product1.price);
	});

	it('should get product By Id', async () => {
		let res = await productModel.getProductById(product1Response.id as number);

		expect(res.name).toBe(product1.name);
		expect(res.price).toBe(product1.price);
	});

	it('should get product By name', async () => {
		let res = await productModel.getProductByName(
			product1Response.name as string,
		);

		expect(res.name).toBe(product1.name);
		expect(res.price).toBe(product1.price);
	});

	it('should get all products ', async () => {
		let res = await productModel.getAllProducts();
		console.log(res);

		expect(res.length).toBe(2);
	});

	it('should update product 1 ', async () => {
		product1Response = await productModel.updateProduct({
			id: product1Response.id,
			name: 'rice',
			price: 20,
		});

		expect(product1Response.name).toBe('rice');
		expect(product1Response.price).toBe(20);
	});

	it('should delete product 1 ', async () => {
		await productModel.deleteProduct(product1Response.id as number);
		let res = await productModel.getAllProducts();

		expect(res.length).toBe(1);
		expect(res[0].name).toBe(product2.name);
	});

	it('should delete product 2 ', async () => {
		await productModel.deleteProduct(product2Response.id as number);
		let res = await productModel.getAllProducts();

		expect(res.length).toBe(0);
	});
});
