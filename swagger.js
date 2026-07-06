const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '안전 체크 서버 API',
      version: '1.0.0',
      description: '안전 체크리스트 서비스 API 명세',
    },
    servers: [
      {
        url: '/',
        description: '기본 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: '서버 오류' },
          },
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        ChecklistItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: '안전모 착용' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'user01' },
            name: { type: 'string', example: '홍길동' },
            affiliation: { type: 'string', example: '1팀' },
            position: { type: 'string', example: '작업자' },
          },
        },
        HistoryItem: {
          type: 'object',
          properties: {
            date: { type: 'string', example: '2026.07.06' },
            dayOfWeek: { type: 'string', example: '월요일' },
            status: { type: 'string', example: '전체 완료' },
            checkedCount: { type: 'integer', example: 6 },
            totalCount: { type: 'integer', example: 6 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./docs/*.docs.js'],
};

module.exports = swaggerJSDoc(options);
