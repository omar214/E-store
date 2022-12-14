import db from '../database';
import IOrder, { ord_product, userOrder } from '../types/order';

const getAllOrders = async (): Promise<IOrder[]> => {
	try {
		const client = await db.connect();
		const sql = 'SELECT * FROM orders;';
		const res = await client.query(sql);
		client.release();
		return res.rows;
	} catch (error) {
		throw error;
	}
};

const getUserOrders = async (userId: number): Promise<IOrder[]> => {
	try {
		const client = await db.connect();
		const sql = `SELECT *
			FROM orders
			WHERE orders.userid=$1
		`;
		const res = await client.query(sql, [userId]);
		client.release();

		return res.rows;
	} catch (error) {
		throw error;
	}
};

const getUserCompletedOrders = async (userId: number): Promise<IOrder[]> => {
	try {
		const client = await db.connect();
		const sql = `SELECT *
			FROM orders
			WHERE orders.userid=$1 AND status = 'complete'
		`;
		const res = await client.query(sql, [userId]);
		client.release();

		return res.rows;
	} catch (error) {
		throw error;
	}
};

const getOrderById = async (id: number): Promise<IOrder> => {
	try {
		const client = await db.connect();
		const sql = 'SELECT * FROM orders WHERE id =($1);';
		const res = await client.query(sql, [id]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const addOrder = async (ord: IOrder): Promise<IOrder> => {
	try {
		const client = await db.connect();
		const sql = `INSERT INTO orders  (userId, status) values (
        ($1), ($2)  )
        RETURNING  id , status , userid as userId;
      `;

		const res = await client.query(sql, [ord.userId, ord.status || 'open']);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const updateOder = async (ord: IOrder): Promise<IOrder> => {
	try {
		const client = await db.connect();
		const sql = `UPDATE orders SET userId=$1 , status=$2
                   WHERE id=$3 
                   RETURNING id, userId ,status`;

		const res = await client.query(sql, [ord.userId, ord.status, ord.id]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const deleteOrder = async (id: number): Promise<void> => {
	try {
		const client = await db.connect();

		let sql = `DELETE from orders_products WHERE orderid =($1)`;
		let res = await client.query(sql, [id]);

		sql = `DELETE from orders WHERE id =($1)`;
		res = await client.query(sql, [id]);
		client.release();
	} catch (error) {
		throw error;
	}
};

const addOrderProducts = async (
	order_products: ord_product[],
	orderId: number,
): Promise<void> => {
	try {
		const client = await db.connect();
		order_products.map(async (o) => {
			const sql = `INSERT INTO orders_products (orderId, productId, quantity)
						VALUES ($1, $2, $3);
			`;
			const res = await client.query(sql, [orderId, o.product_id, o.quantity]);
		});
		client.release();
		console.log('all products added');
	} catch (error) {
		throw error;
	}
};

export default {
	getAllOrders,
	getOrderById,
	addOrder,
	updateOder,
	deleteOrder,
	getUserOrders,
	addOrderProducts,
	getUserCompletedOrders,
};
