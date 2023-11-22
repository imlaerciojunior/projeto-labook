-- Active: 1699404862099@@127.0.0.1@3306
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
        likes REAL NOT NULL,
        dislikes_numbers REAL NOT NULL,
        created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S','now','localtime')),
        updated_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S','now','localtime'))
    );

DROP TABLE posts;

INSERT INTO posts(id, creator_id, content, likes, dislikes_numbers)
VALUES ('p001', 'u001', 'Ola, tudo bem?', 7, 2), 
       ('p002', 'u002', 'Oi, tudo bem. E você?', 9, 1 );


CREATE TABLE 
    likes_dislikes(
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL
    )


SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes;