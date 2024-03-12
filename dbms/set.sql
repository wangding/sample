drop database if exists set_demo;
create database set_demo;

use set_demo;

create table set_a (
  m int,
  n int
);

create table set_b (
  m int,
  n int
);

create table set_c (
  c1 char(1),
  c2 char(1)
);

insert into set_a values (1, 2), (2, 3), (3, 4);
insert into set_b values (1, 2), (1, 3), (3, 4);
insert into set_c values ('a', 'x'), ('b', 'y'), ('c', 'z');
