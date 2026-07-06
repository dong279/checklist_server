CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50) NOT NULL DEFAULT '',
  affiliation VARCHAR(100) NOT NULL DEFAULT '',
  position VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checklist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);

CREATE TABLE checklist_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  checked_date DATE NOT NULL,
  UNIQUE KEY unique_check (user_id, item_id, checked_date),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES checklist_items(id)
);

INSERT INTO checklist_items (title) VALUES
  ('안전모 착용'),
  ('안전화 착용'),
  ('안전조끼 착용'),
  ('보호장갑 착용'),
  ('보호안경 착용'),
  ('건강 상태 이상 없음');