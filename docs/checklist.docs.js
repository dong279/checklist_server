/**
 * @swagger
 * tags:
 *   name: Checklist
 *   description: 안전 체크리스트
 */

/**
 * @swagger
 * /checklist/items:
 *   get:
 *     summary: 고정 항목 목록 조회
 *     tags: [Checklist]
 *     responses:
 *       200:
 *         description: 체크리스트 항목 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChecklistItem'
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /checklist/today:
 *   get:
 *     summary: 오늘 체크된 항목 ID 목록 조회
 *     tags: [Checklist]
 *     responses:
 *       200:
 *         description: 오늘 체크된 item_id 배열
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkedItemIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /checklist/today-progress:
 *   get:
 *     summary: 오늘 진행률 조회
 *     tags: [Checklist]
 *     responses:
 *       200:
 *         description: 오늘 체크 완료 개수와 전체 개수
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkedCount:
 *                   type: integer
 *                   example: 3
 *                 totalCount:
 *                   type: integer
 *                   example: 6
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /checklist/check:
 *   post:
 *     summary: 체크 추가
 *     tags: [Checklist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId]
 *             properties:
 *               itemId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 체크 완료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: itemId 누락
 *       500:
 *         description: 서버 오류
 *   delete:
 *     summary: 체크 해제
 *     tags: [Checklist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId]
 *             properties:
 *               itemId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 체크 해제 완료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: itemId 누락
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /checklist/yesterday-status:
 *   get:
 *     summary: 전날 체크 완료 여부 조회
 *     tags: [Checklist]
 *     responses:
 *       200:
 *         description: 전날 모든 항목 체크 완료 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allChecked:
 *                   type: boolean
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /checklist/history:
 *   get:
 *     summary: 날짜별 체크 기록 히스토리 조회
 *     tags: [Checklist]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [all, week, day]
 *           default: all
 *         description: all(전체, 기본값) | week(이번 주) | day(오늘)
 *     responses:
 *       200:
 *         description: 히스토리 및 통계
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visitCount:
 *                   type: integer
 *                   example: 12
 *                 averageRate:
 *                   type: integer
 *                   example: 96
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HistoryItem'
 *       500:
 *         description: 서버 오류
 */
