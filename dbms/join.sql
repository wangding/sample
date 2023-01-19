drop database if exists join_demo;

create database join_demo;

use join_demo;

drop table if exists tb_a;

create table tb_a (
  c1 char(1),
  c2 char(2),
  c3 int
);

insert into tb_a(c1, c2, c3) values ('a', 'x1', 1), ('b', 'x2', 2), ('c', 'x3', 3);

drop table if exists tb_b;

create table tb_b (
  c1 int,
  c2 char(2)
);

insert into tb_b(c1, c2) values (1, 'y1'), (2, 'y2'), (4, 'y3');

create table tb_c (
  c1 int,
  c4 char(2),
  c3 char(1)
);

insert into tb_c(c1, c4, c3) values (1, 'x1', 'a'), (2, 'x2', 'b'), (3, 'x3', 'c');
