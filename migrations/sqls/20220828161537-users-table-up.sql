/* Replace with your SQL commands */

CREATE TABLE users (
  id SERIAL PRIMARY KEY , 
  email VARCHAR(50) NOT NULL, 
  first_name VARCHAR(50) NOT NULL, 
  last_name VARCHAR(50) NOT NULL, 
  password VARCHAR(500) NOT NULL
);