/**
 * @swagger
 * tags:
 *   name: User
 *   description: 내 정보 조회 / 수정
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 유저 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 유저를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *   put:
 *     summary: 내 정보 수정
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               affiliation:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       200:
 *         description: 정보가 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: 수정할 정보가 없음
 *       500:
 *         description: 서버 오류
 */
