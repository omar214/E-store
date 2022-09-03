import dotenv from 'dotenv';
dotenv.config();

const {
	PORT,
	ENV,
	PG_HOST,
	PG_PORT,
	PG_DATABASE_DEV,
	PG_DATABASE_TEST,
	PG_PASSWORD,
	PG_USER,
	SALT,
	PEPPER,
	JWT_PASSWORD,
} = process.env;

const DATABASE = ENV === 'dev' ? PG_DATABASE_DEV : PG_DATABASE_TEST;

const config = {
	PORT: PORT || 5000,
	ENV,
	PG_HOST,
	PG_PORT,
	PG_DATABASE: DATABASE,
	PG_PASSWORD,
	PG_USER,
	SALT,
	PEPPER,
	JWT_PASSWORD,
};
export default config;
