/* Replace with your SQL commands */
CREATE TABLE orders(
  id SERIAL PRIMARY KEY , 
  userId INTEGER NOT NULL, 
  status VARCHAR(20) , 

  FOREIGN KEY(userId) REFERENCES users(id)
);