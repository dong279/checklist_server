# Checklist Server

일일 체크리스트 관리 REST API 서버입니다.  
JWT 인증 기반으로 유저별 체크 기록을 관리하고, 전날 완료 여부를 프론트엔드에 제공합니다.

## 기술 스택

- Node.js / Express
- MySQL (mysql2)
- JWT (jsonwebtoken)
- bcrypt

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사해 `.env` 파일을 만들고 값을 채웁니다.

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=checklist_db
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3. DB 초기화

MySQL에서 `schema.sql`을 실행합니다.

```bash
mysql -u root -p < schema.sql
```

### 4. 서버 실행

```bash
# 개발
npm run dev

# 프로덕션
npm start
```

## API

모든 `/checklist`, `/user` 엔드포인트는 `Authorization: Bearer <token>` 헤더가 필요합니다.

전체 API 명세는 서버 실행 후 Swagger UI(`/api-docs`)에서 확인할 수 있습니다.

```
http://localhost:<PORT>/api-docs
```

명세 소스는 [swagger.js](swagger.js)(설정)와 [docs/](docs/) 폴더의 `*.docs.js` 파일들에 있습니다.

### 인증

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/auth/register` | 회원가입 (`username`, `password`, `name`, `affiliation`, `position`) |
| POST | `/auth/login` | 로그인 → JWT 반환 |

### 체크리스트

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/checklist/items` | 전체 항목 목록 조회 |
| GET | `/checklist/today` | 오늘 체크한 항목 ID 목록 |
| GET | `/checklist/today-progress` | 오늘 진행률 (`{ checkedCount, totalCount }`) |
| POST | `/checklist/check` | 항목 체크 (`{ itemId }`) |
| DELETE | `/checklist/check` | 항목 체크 해제 (`{ itemId }`) |
| GET | `/checklist/yesterday-status` | 전날 전부 체크 여부 (`{ allChecked: true/false }`) |
| GET | `/checklist/history?filter=all\|week\|day` | 날짜별 체크 기록 + 방문 횟수/평균 완료율 |

### 유저

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/user/me` | 내 정보 조회 |
| PUT | `/user/me` | 내 정보 수정 (`name`, `affiliation`, `position` 중 일부) |
