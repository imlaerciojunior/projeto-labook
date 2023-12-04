-- Active: 1701209475737@@127.0.0.1@3306
CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S','now','localtime')
        )
    );

DROP TABLE users;

INSERT INTO users (id, name, email, password, role)
VALUES ('u001','Junior','junior@email.com','junior123','NORMAL'), 
       ('u002','Bruno','bruno@email.com','bruno123','NORMAL');

CREATE TABLE
    posts(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT UNIQUE NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S','now','localtime')),
        updated_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S','now','localtime')),
        FOREIGN KEY (creator_id) REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );

DROP TABLE posts;

INSERT INTO posts(id, creator_id, content)
VALUES ('p001', 'u001', 'Ola, tudo bem?'), 
       ('p002', 'u002', 'Oi, tudo bem. E você?');


CREATE TABLE likes_dislikes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO likes_dislikes
VALUES
('u001','p001', 1),
('u002','p002', 1);


UPDATE posts
SET likes = 2
WHERE id = 'p001';

UPDATE posts
SET likes = 1, dislikes = 1
WHERE id = 'p002';


SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes;