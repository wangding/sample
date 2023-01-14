drop database if exists set_demo;

create database set_demo;

use set_demo;

drop table if exists set_a;

create table set_a (
  m int,
  n int
);

insert into set_a(m, n) values (1, 2), (2, 3), (3, 4);

drop table if exists set_b;

create table set_b (
  m int,
  n int
);

insert into set_b(m, n) values (1, 2), (1, 3), (3, 4);
