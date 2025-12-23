# 安全前端應用 (HttpOnly Cookie + CSRF Token)

這是一個使用 HttpOnly Cookie 和 CSRF Token 雙重防護的安全前端應用。

## 安全特性

### 1. HttpOnly Cookie
- JWT Token 存放在 HttpOnly Cookie 中
- JavaScript 無法直接存取 Cookie 內容
- 防止 XSS 攻擊竊取認證 Token

### 2. CSRF Token 防護
- 後端生成 CSRF Token 並返回給前端
- 前端在敏感操作時需要在 Header 中攜帶 X-CSRF-Token
- 後端驗證 CSRF Token 與 Session 綁定的值是否匹配

### 3. SameSite Cookie 設置
- Cookie 設置 SameSite=Lax
- 防止跨站請求攜帶 Cookie

## 如何運行

### 方法一：使用 npm（開發模式）

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

前端將運行在 http://localhost:5174

### 方法二：使用 Docker Compose

在專案根目錄執行：

```bash
docker-compose up
```

## 測試帳號

- 帳號：`user`
- 密碼：`password`

## API 端點

### 認證相關 (secure-auth)

| 端點 | 方法 | 說明 | CSRF 保護 |
|------|------|------|-----------|
| `/secure-auth/login` | POST | 登入，設置 HttpOnly Cookie | 否 |
| `/secure-auth/logout` | POST | 登出，清除 Cookie | 否 |
| `/secure-auth/csrf-token` | GET | 獲取 CSRF Token | 否 |
| `/secure-auth/check` | GET | 檢查認證狀態 | 否 |
| `/secure-auth/profile` | GET | 獲取用戶資料 | 是 |
| `/secure-auth/transfer` | POST | 模擬轉帳操作 | 是 |

## 架構說明

```
前端 (React + Vite)
    |
    |-- 登入請求 --> /secure-auth/login
    |               <-- 設置 HttpOnly Cookie + 返回 CSRF Token
    |
    |-- 敏感操作 --> 攜帶 Cookie (自動) + X-CSRF-Token Header
    |               <-- 後端驗證兩者
```

## 與不安全版本的對比

| 特性 | 不安全版本 (react-app) | 安全版本 (secure-react-app) |
|------|------------------------|----------------------------|
| Token 存儲 | localStorage | HttpOnly Cookie |
| XSS 防護 | ❌ Token 可被竊取 | ✅ Cookie 無法被 JS 讀取 |
| CSRF 防護 | ❌ 無 | ✅ CSRF Token 驗證 |
| Token 攜帶 | 手動設置 Authorization Header | 瀏覽器自動攜帶 Cookie |
