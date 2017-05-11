-- create database bamazon_db;
use bamazon_db;

create table products (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name varchar(30) not null,
    department_name varchar(30) not null,
    price integer(11) not null,
    stock_quantity integer(11),
    primary key(id)
);

create table users (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
	username varchar(20) not null,
    pass varchar(30) not null,
    userType varchar(10) not null,
	primary key(id)
);
