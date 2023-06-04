-- Active: 1680034004573@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    dislikes INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator TEXT NOT NULL,
    FOREIGN KEY(creator) REFERENCES users(id)
);

CREATE TABLE likes_dislikes (
    userId TEXT NOT NULL,
    postId TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(postId) REFERENCES posts(id)
);

INSERT INTO users (id, name, email, password, role)
VALUES
    ("u001", "Brenno", "brenno@email.com", "1234", "NORMAL"),
    ("u002", "João", "joao@email.com", "4321", "NORMAL"),
    ("u003", "Larissa", "larissa@email.com", "2345", "NORMAL");

UPDATE users SET role = 'ADMIN' WHERE id = '0c4ff410-8350-467d-ae38-15ab48afb8aa';

SELECT * FROM users;

DROP TABLE users;

INSERT INTO posts (id, creator, content)
VALUES
    ("p001", "u001", "Hello World!"),
    ("p002", "u002", "First post!"),
    ("p003", "u003", "Hi, everyone!");

SELECT * FROM posts;

DROP TABLE posts;

INSERT INTO likes_dislikes (userId, postId, like)
VALUES
    ("u001", "p001", 1),
    ("u002", "p001", 0),
    ("u003", "p002", 1);

SELECT * FROM likes_dislikes;

DROP TABLE likes_dislikes;