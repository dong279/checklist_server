const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// 모든 라우트에 JWT 인증 적용
router.use(authMiddleware);

// 내 정보 조회
router.get('/me', async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      'SELECT id, username, name, affiliation, position FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 내 정보 수정
router.put('/me', async (req, res) => {
  const userId = req.user.id;
  const { name, affiliation, position } = req.body;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (affiliation !== undefined) {
    fields.push('affiliation = ?');
    values.push(affiliation);
  }
  if (position !== undefined) {
    fields.push('position = ?');
    values.push(position);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: '수정할 정보가 없습니다.' });
  }

  try {
    values.push(userId);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

    res.json({ message: '정보가 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
