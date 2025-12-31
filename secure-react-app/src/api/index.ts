import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, //允許帶 Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// CSRF Token
let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const getCsrfToken = () => csrfToken;

export const clearCsrfToken = () => {
  csrfToken = null;
};

// 請求攔截器：自動添加 X-CSRF-Token Header
api.interceptors.request.use(
  (config) => {
    // 對於需要 CSRF 保護的請求（包括登入！）
    // 只排除獲取 CSRF Token 的端點
    if (
      csrfToken &&
      config.url !== "/secure-auth/csrf-token" &&
      config.url !== "/secure-auth/anonymous-csrf-token"
    ) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除 CSRF Token
      clearCsrfToken();
      // 可以在這裡導向登入頁面
    }
    if (error.response?.status === 403) {
      // CSRF Token 無效，嘗試重新獲取
      console.warn("CSRF token invalid or missing");
    }
    return Promise.reject(error);
  }
);

// API 方法
export const authApi = {
  // 獲取匿名 CSRF Token（用於登入前）
  getAnonymousCsrfToken: async () => {
    const response = await api.get("/secure-auth/anonymous-csrf-token");
    if (response.data.csrfToken) {
      setCsrfToken(response.data.csrfToken);
    }
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post("/secure-auth/login", {
      username,
      password,
    });
    // 登入成功後保存 CSRF Token
    if (response.data.csrfToken) {
      setCsrfToken(response.data.csrfToken);
    }
    return response.data;
  },

  // 登出
  logout: async () => {
    const response = await api.post("/secure-auth/logout");
    clearCsrfToken();
    return response.data;
  },

  // 獲取 CSRF Token（用於頁面刷新時）
  getCsrfToken: async () => {
    const response = await api.get("/secure-auth/csrf-token");
    if (response.data.csrfToken) {
      setCsrfToken(response.data.csrfToken);
    }
    return response.data;
  },

  // 檢查認證狀態
  checkAuth: async () => {
    const response = await api.get("/secure-auth/check");
    return response.data;
  },

  // 獲取用戶資料（需要 CSRF Token）
  getProfile: async () => {
    const response = await api.get("/secure-auth/profile");
    return response.data;
  },

  // 模擬轉帳（需要 CSRF Token）
  transfer: async (amount: number, toAccount: string) => {
    const response = await api.post("/secure-auth/transfer", {
      amount,
      toAccount,
    });
    return response.data;
  },
};

export default api;

