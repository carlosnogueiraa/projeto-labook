-- Active: 1680034004573@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id)
);

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id)
);

INSERT INTO users (id, name, email, password, role, created_at)
VALUES
    ("u001", "Brenno", "brenno@email.com", "1234", "user", DATETIME()),
    ("u002", "João", "joao@email.com", "4321", "user", DATETIME()),
    ("u003", "Larissa", "larissa@email.com", "2345", "user", DATETIME());

SELECT * FROM users;

DROP TABLE users;

INSERT INTO posts (id, creator_id, content, likes, dislikes, created_at, updated_at)
VALUES
    ("p001", "u001", "Hello World!", 10, 2, DATETIME(), DATETIME()),
    ("p002", "u002", "First post!", 8, 1, DATETIME(), DATETIME()),
    ("p003", "u003", "Hi, everyone!", 9, 3, DATETIME(), DATETIME());

SELECT * FROM posts;

DROP TABLE posts;

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
    ("u001", "p001", 1),
    ("u002", "p001", 0),
    ("u003", "p002", 1);

SELECT * FROM likes_dislikes;

DROP TABLE likes_dislikes;