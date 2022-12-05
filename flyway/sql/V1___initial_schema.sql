CREATE TABLE users (
  id VARCHAR ( 50 ) PRIMARY KEY NOT NULL
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  author_id VARCHAR ( 50 ) NOT NULL,
  content TEXT NOT NULL,
  vote INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_author FOREIGN KEY(author_id) REFERENCES users(id)
);

CREATE TABLE replies (
  id SERIAL PRIMARY KEY,
  author_id VARCHAR ( 50 ) NOT NULL,
  message_id INT NOT NULL,
  content TEXT NOT NULL,
  vote INT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_author FOREIGN KEY(author_id) REFERENCES users(id),
  CONSTRAINT fk_post FOREIGN KEY(message_id) REFERENCES messages(id)
);

