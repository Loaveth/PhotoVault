create table if not exists users(
  name text primary key,
  bcryptPassword text not null,
  level int not null default 1 /* 1=member 8+=admin */
);

create table if not exists photos(
  id integer primary key,
  filename text not null,
  caption text,
  uploadedBy text not null,
  uploadedAt datetime not null default current_timestamp,
  foreign key (uploadedBy) references users(name)
);

create table if not exists likes(
    userName text not null,
    photoId integer not null,
    primary key(userName, photoId),
    foreign key(userName) references users(name) on delete cascade,
    foreign key(photoId) references photos(id) on delete cascade
);

insert or replace into users(name,bcryptPassword,level) values(
  'admin',
  '$2b$12$9BwyzrkCBioedc6.YLh6xO8jWpHfMeN6hrguMR7qAY7m8CSGrt8Si',
  9
);

insert or replace into users(name,bcryptPassword,level) values(
    'user',
    '$2b$12$aSC4i0puHmBhEOPdm/ocKOJD4Se3KiajWMznvdx4vN.p./yEWfuee',
    1
);

insert or replace into photos (id,filename, caption, uploadedBy) values
    (1, 'aib_und_lia.png', 'Lia and Aibo as kids', 'admin'),
    (2, 'Firefly_aibo_lia.png', 'Lia and Aibo just sitting', 'admin'),
    (3, 'nowaaaay.png', 'no waaaaaaay', 'user');


insert or replace into likes (userName, photoId) values
('admin', 3),
('user', 1),
('user', 2);

