import db from '../database';
import IOrder from '../types/order';

const OrderModel = () => {
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
	const getOrder = async (id: number): Promise<IOrder> => {
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
			const sql = `INSERT INTO orders  (ord.userId, ord.status) values (
        ($1), ($2)  )
        RETURNING id,userId, status;
      `;

			const res = await client.query(sql, [
				ord.userId,
				ord.status || 'Pending',
			]);
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
			const sql = `DELETE from orders WHERE id =($1)`;
			const res = await client.query(sql, [id]);
			client.release();
			console.log('user deleted ');
		} catch (error) {
			throw error;
		}
	};

	return {
		getAllOrders,
		getOrder,
		addOrder,
		updateOder,
		deleteOrder,
	};
};

export default OrderModel;
