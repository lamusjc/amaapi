CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT NOT NULL,
    payment_status VARCHAR(200) NOT NULL,
    PRIMARY KEY (payment_id)
);

CREATE TABLE category (
    category_id INT AUTO_INCREMENT NOT NULL,
    category_name VARCHAR(200) NOT NULL,
    PRIMARY KEY (category_id)
);

CREATE TABLE users (
    users_id INT AUTO_INCREMENT NOT NULL,
    users_name VARCHAR(20) NOT NULL,
    users_lastname VARCHAR(20) NOT NULL,
    users_username VARCHAR(100) NOT NULL,
    users_password VARCHAR(200) NOT NULL,
    users_admin BOOLEAN NOT NULL,
    users_registered BOOLEAN NOT NULL,
    users_code VARCHAR(10),
    PRIMARY KEY (users_id)
);

CREATE TABLE posts (
    posts_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    category_id INT NOT NULL,
    posts_title VARCHAR(100) NOT NULL,
    posts_description VARCHAR(500) NOT NULL,
    posts_price DOUBLE PRECISION NOT NULL,
    posts_created_at DATETIME NOT NULL,
    posts_quantity INT NOT NULL,
    posts_image VARCHAR(1000),
    posts_deleted_description VARCHAR(200),
    posts_deleted BOOLEAN NOT NULL,
    PRIMARY KEY (posts_id)
);

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT NOT NULL,
    posts_id INT NOT NULL,
    users_id INT NOT NULL,
    cart_status BOOLEAN NOT NULL,
    PRIMARY KEY (cart_id)
);

CREATE TABLE payment_cart (
    payment_cart_id INT AUTO_INCREMENT NOT NULL,
    cart_id INT NOT NULL,
    payment_id INT NOT NULL,
    PRIMARY KEY (payment_cart_id)
);

ALTER TABLE
    payment_cart
ADD
    CONSTRAINT payment_payment_cart_fk FOREIGN KEY (payment_id) REFERENCES payment (payment_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    posts
ADD
    CONSTRAINT category_posts_fk FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    posts
ADD
    CONSTRAINT users_posts_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    cart
ADD
    CONSTRAINT users_cart_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    cart
ADD
    CONSTRAINT posts_cart_fk FOREIGN KEY (posts_id) REFERENCES posts (posts_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    payment_cart
ADD
    CONSTRAINT cart_payment_cart_fk FOREIGN KEY (cart_id) REFERENCES cart (cart_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

INSERT INTO
    category(category_name)
VALUES
    ('Tecnologia');

INSERT INTO
    category(category_name)
VALUES
    ('Belleza');

INSERT INTO
    category(category_name)
VALUES
    ('Ropa');

INSERT INTO
    category(category_name)
VALUES
    ('Musica');

INSERT INTO
    category(category_name)
VALUES
    ('Libros');

INSERT INTO
    category(category_name)
VALUES
    ('Otros');