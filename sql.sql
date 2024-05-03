create database nodelogin;

create table users (
    id SERIAL PRIMARY key,
    name varcha(200),
    email varchar(225),
    password varchar(200)
);

CREATE TABLE Product (
    product_id SERIAL PRIMARY key,
    id INT NOT NULL,
    product_name varchar(225),
    price DECIMAL(5,2) NOT NULL,
    listing_des TEXT,
    pub varchar(15),
    condition varchar(15),
    imageurl varchar(200),
    Foreign key (id) REFERENCES users(id)
);

create table cart(
    id INT NOT NULL,
    product_id INT,
    Foreign key (product_id) REFERENCES Product(product_id),
    Foreign key (id) REFERENCES users(id)
);

create table wishlist(
    id INT,
    product_id INT,
    Foreign key (product_id) REFERENCES Product(product_id),
    Foreign key (id) REFERENCES users(id)
);