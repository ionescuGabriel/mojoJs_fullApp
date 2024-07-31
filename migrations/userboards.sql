/*
Migrations
To manage your database schema, there is also a minimal SQL based migration system built-in.
A migration file is just a collection of SQL blocks, with one or more statements, separated by comments of the form -- VERSION UP/DOWN.

NO COMMENT...
*/

-- 1 up
create table if not exists users (
  id    serial primary key,
  username text,
  pw  text
);

-- 1 down
drop table if exists users;


-- 2 up
create table if not exists users_post (
  id serial primary key,
  sender_id integer,
  receiver_id integer,
  post_text text
);

-- 2 down
drop table if exists users_post;