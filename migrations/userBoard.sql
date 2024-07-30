create table if not exists users (
  id    serial primary key,
  username text,
  pw  text,
);

drop table if exists users;

create table if not exists users_posts (
  post_id serial primary key,
  sender_id integer references users(id),
  receiver_id integer references users(id),
  post_text text
  );