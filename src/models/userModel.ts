import { genSaltSync, hashSync } from 'bcryptjs';
import config from '../config';
import db from '../database';
import IUser from '../types/user';

const hashPassowrd = (password: string | number) => {
	const hash = hashSync(`${password}${config.PEPPER}`, config.SALT);
	return hash;
};
const userModel = () => {
	const getAll = async (): Promise<IUser[]> => {
		try {
			const client = await db.connect();
			const sql = 'SELECT * FROM users;';
			const res = await client.query(sql);
			client.release();
			return res.rows;
		} catch (error) {
			throw error;
		}
	};
	const getUser = async (id: number): Promise<IUser> => {
		try {
			const client = await db.connect();
			const sql = 'SELECT * FROM users WHERE id =($1);';
			const res = await client.query(sql, [id]);
			client.release();
			return res.rows[0];
		} catch (error) {
			throw error;
		}
	};
	const addUser = async (user: IUser): Promise<IUser> => {
		try {
			const client = await db.connect();
			const sql = `INSERT INTO users ( email,first_name, last_name, password) values (
        ($1), ($2),($3), ($4) 
        RETURNING id,email,first_name,last_name
      )`;

			const res = await client.query(sql, [
				user.email,
				user.first_name,
				user.last_name,
				hashPassowrd(user.password as string),
			]);
			client.release();
			return res.rows[0];
		} catch (error) {
			throw error;
		}
	};
	const updateUser = async (user: IUser): Promise<IUser> => {
		try {
			const client = await db.connect();
			const sql = `UPDATE users SET email=$1 , first_name=$2 , last_name=$3 , password=$4 
                   WHERE id=$5 
                   RETURNING id, email, first_name, last_name`;

			const res = await client.query(sql, [
				user.email,
				user.first_name,
				user.last_name,
				hashPassowrd(user.password as string),
				user.id,
			]);
			client.release();
			return res.rows[0];
		} catch (error) {
			throw error;
		}
	};
	const deleteUser = async (id: number): Promise<void> => {
		try {
			const client = await db.connect();
			const sql = `DELETE from users WHERE id =($1)`;
			const res = await client.query(sql, [id]);
			client.release();
			console.log('user deleted ');
		} catch (error) {
			throw error;
		}
	};

	return { getAll, getUser, addUser, updateUser, deleteUser };
};

export default userModel;
