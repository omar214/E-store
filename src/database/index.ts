import { Pool } from 'pg';
import config from '../config';

const pool = new Pool({
	host: config.PG_HOST,
	database: config.PG_DATABASE,
	user: config.PG_USER,
	password: config.PG_PASSWORD,
	port: parseInt(config.PG_PORT as string),
});

pool.on('error', (error: Error) => {
	console.error(`Error: ${error.message}`);
	console.error(`Error inside`);
});

export default pool;

// // test connection
// (async function () {
// 	const client = await pool.connect();
// 	const res = await client.query('SELECT NOW()');
// 	console.log(res.rows);
// 	client.release();
// })();
