drop schema if exists cccat16 cascade;

create schema cccat16;

create table cccat16.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false
);

-- set schema 'cccat16';

-- select * from account;

-- select name,email,is_passenger,is_driver from account where is_driver='true';