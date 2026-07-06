const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();
require('dotenv').config();

app.use(express.json());

// API 문서 (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우터 연결
app.use('/auth', require('./routes/auth'));
app.use('/checklist', require('./routes/checklist'));
app.use('/user', require('./routes/user'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
