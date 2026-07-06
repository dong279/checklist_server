const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

// 서버 로컬 시간 기준 YYYY-MM-DD
const toDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 서버 로컬 시간 기준 YYYY.MM.DD
const toDotDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

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

// 오늘 진행률 조회
router.get('/today-progress', async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const [[{ totalCount }]] = await db.query(
      'SELECT COUNT(*) AS totalCount FROM checklist_items'
    );
    const [[{ checkedCount }]] = await db.query(
      'SELECT COUNT(*) AS checkedCount FROM checklist_logs WHERE user_id = ? AND checked_date = ?',
      [userId, today]
    );

    res.json({ checkedCount, totalCount });
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

// 날짜별 체크 기록 히스토리 조회
router.get('/history', async (req, res) => {
  const userId = req.user.id;
  const { filter = 'all' } = req.query;

  try {
    const [[{ totalCount }]] = await db.query(
      'SELECT COUNT(*) AS totalCount FROM checklist_items'
    );

    const [rows] = await db.query(
      `SELECT checked_date, COUNT(*) AS checkedCount
       FROM checklist_logs
       WHERE user_id = ?
       GROUP BY checked_date
       ORDER BY checked_date DESC`,
      [userId]
    );

    // visitCount: 하루라도 1개 이상 체크한 날의 수 (전체 기간)
    const visitCount = rows.length;

    // averageRate: 전체 기록 날짜들의 (checkedCount / totalCount * 100) 평균, 반올림
    const averageRate = rows.length > 0
      ? Math.round(
          rows.reduce((sum, row) => sum + (row.checkedCount / totalCount) * 100, 0) / rows.length
        )
      : 0;

    const now = new Date();
    const todayStr = toDateStr(now);

    const monday = new Date(now);
    const diffToMonday = (now.getDay() + 6) % 7; // 월요일=0 기준 offset
    monday.setDate(now.getDate() - diffToMonday);
    const mondayStr = toDateStr(monday);

    let filteredRows = rows;
    if (filter === 'week') {
      filteredRows = rows.filter((row) => {
        const dateStr = toDateStr(new Date(row.checked_date));
        return dateStr >= mondayStr && dateStr <= todayStr;
      });
    } else if (filter === 'day') {
      filteredRows = rows.filter(
        (row) => toDateStr(new Date(row.checked_date)) === todayStr
      );
    }

    const history = filteredRows.map((row) => {
      const date = new Date(row.checked_date);
      return {
        date: toDotDateStr(date),
        dayOfWeek: DAY_NAMES[date.getDay()],
        status: row.checkedCount >= totalCount ? '전체 완료' : '일부 미흡',
        checkedCount: row.checkedCount,
        totalCount,
      };
    });

    res.json({ visitCount, averageRate, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
