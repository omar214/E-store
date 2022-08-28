import db from '../database';
import IProduct from '../types/product';

const getAllProducts = async (): Promise<IProduct[]> => {
	try {
		const client = await db.connect();
		const sql = 'SELECT * FROM products;';
		const res = await client.query(sql);
		client.release();
		return res.rows;
	} catch (error) {
		throw error;
	}
};
const getProductById = async (id: number): Promise<IProduct> => {
	try {
		const client = await db.connect();
		const sql = 'SELECT * FROM products WHERE id =($1);';
		const res = await client.query(sql, [id]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const getProductByName = async (name: string): Promise<IProduct> => {
	try {
		const client = await db.connect();
		const sql = 'SELECT * FROM products WHERE name =($1);';
		const res = await client.query(sql, [name]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const addProduct = async (p: IProduct): Promise<IProduct> => {
	try {
		const client = await db.connect();
		const sql = `INSERT INTO products ( name, price) values (
        ($1), ($2))
        RETURNING id,name, price;
      `;

		const res = await client.query(sql, [p.name, p.price]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const updateProduct = async (p: IProduct): Promise<IProduct> => {
	try {
		const client = await db.connect();
		const sql = `UPDATE products SET name=$1 , price=$2
                   WHERE id=$3 
                   RETURNING id, name,price`;

		const res = await client.query(sql, [p.name, p.price, p.id]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const deleteProduct = async (id: number): Promise<void> => {
	try {
		const client = await db.connect();
		const sql = `DELETE from products WHERE id =($1)`;
		const res = await client.query(sql, [id]);
		client.release();
		console.log('user deleted ');
	} catch (error) {
		throw error;
	}
};

const productModel = {
	getAllProducts,
	getProductById,
	addProduct,
	updateProduct,
	deleteProduct,
	getProductByName,
};
export default productModel;
