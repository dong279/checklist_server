const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// 모든 라우트에 JWT 인증 적용
router.use(authMiddleware);

// 고정 항목 목록 조회
router.get('/items', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM checklist_items');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 오늘 체크 기록 조회
router.get('/today', async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const [logs] = await db.query(
      'SELECT item_id FROM checklist_logs WHERE user_id = ? AND checked_date = ?',
      [userId, today]
    );
    const checkedItemIds = logs.map((log) => log.item_id);
    res.json({ checkedItemIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 체크 추가
router.post('/check', async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  if (!itemId) {
    return res.status(400).json({ message: 'itemId가 필요합니다.' });
  }

  try {
    await db.query(
      'INSERT IGNORE INTO checklist_logs (user_id, item_id, checked_date) VALUES (?, ?, ?)',
      [userId, itemId, today]
    );
    res.json({ message: '체크 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 체크 해제
router.delete('/check', async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  if (!itemId) {
    return res.status(400).json({ message: 'itemId가 필요합니다.' });
  }

  try {
    await db.query(
      'DELETE FROM checklist_logs WHERE user_id = ? AND item_id = ? AND checked_date = ?',
      [userId, itemId, today]
    );
    res.json({ message: '체크 해제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 전날 체크 완료 여부 → true / false 반환
router.get('/yesterday-status', async (req, res) => {
  const userId = req.user.id;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    // 전체 항목 수
    const [[{ totalCount }]] = await db.query(
      'SELECT COUNT(*) AS totalCount FROM checklist_items'
    );

    // 어제 체크된 수
    const [[{ checkedCount }]] = await db.query(
      'SELECT COUNT(*) AS checkedCount FROM checklist_logs WHERE user_id = ? AND checked_date = ?',
      [userId, yesterdayStr]
    );

    const allChecked = checkedCount >= totalCount;

    res.json({ allChecked }); // true or false
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
