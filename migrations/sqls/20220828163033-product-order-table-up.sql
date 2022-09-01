  /* Replace with your SQL commands */
  CREATE TABLE orders_products(
    orderId INTEGER NOT NULL, 
    productId INTEGER NOT NULL, 
    quantity INTEGER NOT NULL ,

    FOREIGN KEY(orderId) REFERENCES orders(id),
    FOREIGN KEY(productId) REFERENCES products(id),
    PRIMARY KEY(orderId, productId)
  );