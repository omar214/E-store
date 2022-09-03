import { compareSync, hashSync } from 'bcryptjs';
import config from '../config';
import db from '../database';
import IUser from '../types/user';

const hashPassowrd = (password: string | number) => {
	const hash = hashSync(
		`${password}${config.PEPPER}`,
		parseInt(config.SALT as string, 10),
	);
	return hash;
};
const getAllUsers = async (): Promise<IUser[]> => {
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
const getUserById = async (id: number): Promise<IUser> => {
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
const getUserByEmail = async (email: string): Promise<IUser> => {
	try {
		const client = await db.connect();
		const sql = `SELECT * FROM users WHERE email =($1);`;
		const res = await client.query(sql, [email]);
		client.release();
		return res.rows[0];
	} catch (error) {
		throw error;
	}
};
const addUser = async (user: IUser): Promise<IUser> => {
	try {
		const client = await db.connect();
		const sql = `INSERT INTO users ( email,first_name, last_name, password) 
				values ( ($1), ($2),($3), ($4) )
        RETURNING id,email,first_name,last_name;
			`;

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
		// console.log('user deleted ');
	} catch (error) {
		throw error;
	}
};

const authenticateUser = async (
	email: string,
	password: string,
): Promise<boolean> => {
	try {
		const user = await getUserByEmail(email);
		// console.log(user);

		const isMatch = compareSync(
			`${password}${config.PEPPER}`,
			user.password as string,
		);

		return isMatch;
	} catch (error) {
		throw error;
		return false;
	}
};

const userModel = {
	hashPassowrd,
	getAllUsers,
	getUserById,
	getUserByEmail,
	addUser,
	updateUser,
	deleteUser,
	authenticateUser,
};
export default userModel;
