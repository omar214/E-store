import db from '../database';
import ICart from '../types/cart';
import { ord_product } from '../types/order';

const getCartProducts = async (userId: number): Promise<ord_product[]> => {
	try {
		const client = await db.connect();
		const sql = `SELECT product_id  ,quantity FROM cart WHERE cart_owner=$1`;
		const res = await client.query(sql, [userId]);
		client.release();
		return res.rows;
	} catch (error) {
		throw error;
	}
};
const updateCartProduct = async (cart: ICart): Promise<ICart> => {
	try {
		const client = await db.connect();
		const sql = `UPDATE cart SET quantity=$3 
      WHERE cart_owner = $1 
      AND   product_id = $2
      RETURNING *;
		`;
		const res = await client.query(sql, [
			cart.cart_owner,
			cart.product_id,
			cart.quantity,
		]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const addToCart = async (cart: ICart): Promise<ICart> => {
	try {
		const client = await db.connect();
		const sql = `INSERT INTO cart 
      (cart_owner,product_id,quantity) VALUES ($1, $2 , $3)
      RETURNING *; 
    `;
		const res = await client.query(sql, [
			cart.cart_owner,
			cart.product_id,
			cart.quantity,
		]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const deleteFromCart = async (cart: ICart): Promise<ICart> => {
	try {
		const client = await db.connect();
		const sql = `DELETE FROM cart WHERE cart_owner=$1 AND product_id = $2`;

		const res = await client.query(sql, [cart.cart_owner, cart.product_id]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const checkout = async (cart_owner: number): Promise<void> => {
	try {
		const client = await db.connect();
		const sql = `DELETE from cart WHERE cart_owner =($1)`;
		const res = await client.query(sql, [cart_owner]);
		client.release();
		console.log('cart is cleared after checkout');
	} catch (error) {
		throw error;
	}
};

export default {
	getCartProducts,
	updateCartProduct,
	addToCart,
	deleteFromCart,
	checkout,
};
