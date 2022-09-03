import cartModel from '../../models/cartModel';
import userModel from '../../models/userModel';
import productModel from '../../models/productModel';
import ICart from '../../types/cart';
import IUser from '../../types/user';
import IProduct from '../../types/product';
import db from '../../database';

describe('cart model', () => {
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
	let quantity1 = 3,
		quantity2 = 5;
	let cart1: ICart, cart2: ICart;

	it('should add products to cart', async () => {
		cart1 = {
			cart_owner: user1.id,
			product_id: product1.id,
			quantity: quantity1,
		};
		cart2 = {
			cart_owner: user1.id,
			product_id: product2.id,
			quantity: quantity2,
		};

		let cartRes = await cartModel.addToCart(cart1);
		expect(cartRes.cart_owner).toBe(cart1.cart_owner);
		expect(cartRes.product_id).toBe(cart1.product_id);
		expect(cartRes.quantity).toBe(cart1.quantity);

		cartRes = await cartModel.addToCart(cart2);
		expect(cartRes.cart_owner).toBe(cart2.cart_owner);
		expect(cartRes.product_id).toBe(cart2.product_id);
		expect(cartRes.quantity).toBe(cart2.quantity);
	});

	it('should get cart products', async () => {
		let res = await cartModel.getCartProducts(cart1.cart_owner as number);
		expect(res.length).toBe(2);

		expect(res[0].product_id).toBe(cart1.product_id);
		expect(res[0].quantity).toBe(cart1.quantity);

		expect(res[1].product_id).toBe(cart2.product_id);
		expect(res[1].quantity).toBe(cart2.quantity);
	});

	it('should update cart product', async () => {
		quantity1 = 8;
		await cartModel.updateCartProduct({
			...cart1,
			quantity: quantity1,
		});

		const res = await cartModel.getCartProducts(user1.id as number);

		// expect(res.quantity).toBe(quantity1);
	});

	it('should delete from carts', async () => {
		await cartModel.deleteFromCart({
			cart_owner: cart1.cart_owner,
			product_id: cart1.product_id,
		});

		let res = await cartModel.getCartProducts(cart1.cart_owner as number);
		expect(res.length).toBe(1);

		expect(res[0].product_id).toBe(cart2.product_id);
		expect(res[0].quantity).toBe(cart2.quantity);
	});

	it('should checkout ', async () => {
		await cartModel.checkout(cart1.cart_owner as number);

		let res = await cartModel.getCartProducts(cart1.cart_owner as number);
		expect(res.length).toBe(0);
	});
});
