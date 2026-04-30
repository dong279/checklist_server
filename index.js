const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// 라우터 연결
app.use('/auth', require('./routes/auth'));
app.use('/checklist', require('./routes/checklist'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
