# E-Store API

### 🚩About<a name = "about"></a>

API for online store using **typescript, express and postgres**

it's the second project for **udacity advanced full-stack nano-degree**

## 💻Technologies Used<a name = "build"></a>

- **Express Js**
- **Postgres**
- **Typescript**
- **db-migrate** for database migrations
- **JWT**
- **bcryptJS** for hashing passwords
- **Jasmine** for testing
- **Express Js**

<!-- ### ✨ Features <a name = "features"></a>

- Authenticate users using json web tokens
- add proudcts
- make orders
- add orders to cart & **Checkout** -->

## 🏁Getting Started <a name = "start"></a>

1. **_Clone the repository_**

```bash
git clone https://github.com/omar214/e-store.git
```

2. **_Go to the directory of the repository_**

```bash
cd e-store
```

3. **install dependencies**

```bash
npm install

```

4.**add `.env` file**

add .env file similar to this

```py
PORT = 5000

ENV = 'dev'
# ENV = 'test'

# database variables
PG_HOST='localhost'
PG_PORT=5432
PG_USER = APP
PG_DATABASE_DEV= 'store_dev'
PG_DATABASE_TEST= 'store_test'
PG_PASSWORD= 123456

# hash pass
SALT = 10
PEPPER = password

# token pass

JWT_PASSWORD = password
```

5. **create the database**

create 2 DBs one for APP and other for test

```sql
  CREATE DATABASE store_dev;
  CREATE DATABASE store_test;
```

6. **create DB User**

these users will be used to specify which user at the `.env` file

```sql
  CREATE USER APP WITH PASSWORD '123456';
  CREATE USER test WITH PASSWORD '123456';
  GRANT ALL PRIVILEGES ON DATABASE store_dev TO APP;
  GRANT ALL PRIVILEGES ON DATABASE store_test TO test;
```

7.  **configure database**

put the databases data in the database.json similar to this:

```json
{
	"defaultEnv": { "ENV": "NODE_ENV" },
	"dev": {
		"driver": "pg",
		"host": { "ENV": "PG_HOST" },
		"port": { "ENV": "PG_PORT" },
		"database": { "ENV": "PG_DATABASE_DEV" },
		"user": { "ENV": "PG_USER" },
		"password": { "ENV": "PG_PASSWORD" }
	},
	"test": {
		"driver": "pg",
		"host": { "ENV": "PG_HOST" },
		"port": { "ENV": "PG_PORT" },
		"database": { "ENV": "PG_DATABASE_TEST" },
		"user": { "ENV": "PG_USER" },
		"password": { "ENV": "PG_PASSWORD" }
	}
}
```

## 🏁Scripts <a name = "Scripts"></a>

- `npm i` install all the packages
- `npm start` to run the APP after build
- `npm run build` to compile the ts files
- `npm run dev` run app using nodemon
- `npm migrate:run` up all DB migrations
- `npm migrate:run` reset DB

<!-- ## API <a name = "API"></a>

`{baseURL}/api/image?imageName=<image Name>&&width=<width>&&height=<height>`

query parameters:
**imageName**: the name of the image
**width**: the width of the image
**height**: the height of the image -->

##
