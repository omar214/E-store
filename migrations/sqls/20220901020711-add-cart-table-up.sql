/* Replace with your SQL commands */
CREATE TABLE cart (
  cart_owner INTEGER NOT NULL ,
  product_id INTEGER NOT NULL, 
  quantity INTEGER DEFAULT 1 NOT NULL , 

  FOREIGN KEY(cart_owner) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id),

  PRIMARY KEY (cart_owner, product_id)
);