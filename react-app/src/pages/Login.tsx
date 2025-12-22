import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../utils/token";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // 只有在 token 存在且有效時才導向 dashboard
    if (token && isTokenValid(token)) {
      navigate("/dashboard");
    } else if (token && !isTokenValid(token)) {
      // 如果 token 已過期，清除它
      localStorage.removeItem("access_token");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUsernameError(false);
    setPasswordError(false);
    setLoading(true);

    if (!username) {
      setUsernameError(true);
      setLoading(false);
      return;
    }
    if (!password) {
      setPasswordError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      const newToken = response.data.access_token;
      
      // 驗證新取得的 token 是否有效
      if (newToken && isTokenValid(newToken)) {
        localStorage.setItem("access_token", newToken);
        navigate("/dashboard");
      } else {
        // 如果 token 無效，顯示錯誤
        setError("登入失敗，請重試");
        console.error("Invalid token received from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("帳號或密碼錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">魚皮購物</span>
          <span className="text-xl text-gray-600">登入</span>
        </div>
        <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">
          需要幫助?
        </a>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-glow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-glow" style={{ animationDelay: "1s" }}></div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 animate-shimmer"></div>
        
        {/* Swirling lines effect */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 600">
            <path
              d="M0,100 Q100,50 200,100 T400,100"
              stroke="white"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M0,300 Q150,250 300,300 T400,300"
              stroke="white"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </svg>
        </div>

        {/* Left Side - Promotional Banner */}
        <div className="flex-1 relative z-10">
          <div className="h-full flex flex-col items-center justify-center p-12 text-white">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3 animate-float">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-lg">
                <span className="text-blue-500 font-bold text-2xl">F</span>
              </div>
              <span className="text-3xl font-bold">魚皮購物</span>
            </div>

            {/* Main Title */}
            <div className="text-center mb-8">
              <h1 className="text-7xl font-bold mb-2 drop-shadow-lg">1.11</h1>
              <h2 className="text-5xl font-bold drop-shadow-lg">購物節</h2>
            </div>

            {/* Promotional Buttons */}
            <div className="flex gap-4 mb-6">
              <div className="bg-blue-600 border-2 border-blue-700 rounded-lg px-6 py-3 text-center hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
                <div className="text-sm">滿千現折</div>
                <div className="text-xl font-bold">$100</div>
              </div>
              <div className="bg-blue-600 border-2 border-blue-700 rounded-lg px-6 py-3 text-center hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
                <div className="text-sm">刷卡回饋</div>
                <div className="text-xl font-bold">最高20%</div>
              </div>
              <div className="bg-blue-600 border-2 border-blue-700 rounded-lg px-6 py-3 text-center hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
                <div className="text-sm">魚皮直營</div>
                <div className="text-xl font-bold">首購5折</div>
              </div>
            </div>

            {/* Date Range */}
            <div className="text-2xl font-semibold mb-8 drop-shadow-md">12/26 - 1/11</div>

            {/* Blue Coupon */}
            <div className="absolute bottom-12 right-12 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg transform rotate-12 shadow-2xl flex items-center justify-center animate-float" style={{ animationDelay: "1.5s" }}>
              <span className="text-6xl font-bold text-white drop-shadow-lg">%</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-[500px] relative flex flex-col">
          <div className="flex-1 flex items-center justify-center px-12 py-16">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">登入</h2>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username Field */}
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError(false);
                    }}
                    placeholder="電話號碼/使用者名稱/Email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      usernameError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-sm mt-1">請填寫此欄位</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      placeholder="密碼"
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 ${
                        passwordError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L7.05 8.05M6.29 6.29L3 3m3.29 3.29l3.29 3.29m0 0L12 12m-2.42-2.42L6.29 6.29"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">請填寫此欄位</p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {loading ? "登入中..." : "登入"}
                </button>

                {/* Forgot Password */}
                <div className="text-center">
                  <a
                    href="#"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    忘記密碼
                  </a>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">或</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                  <button
                    type="button"
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border-2 border-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center mt-6">
                  <span className="text-gray-600 text-sm">魚皮新朋友? </span>
                  <a
                    href="#"
                    className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
                  >
                    註冊
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 px-8 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-5 gap-8">
          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">客服中心</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-500">
                  幫助中心
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  魚皮商城
                </a>
              </li>
            </ul>
          </div>

          {/* About FishPeel */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">關於魚皮</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-500">
                  關於魚皮
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  加入我們
                </a>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">付款</h3>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                MC
              </div>
              <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                JCB
              </div>
              <div className="w-10 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center">
                VISA
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">關注我們</h3>
            <div className="flex gap-3">
              <a href="#" className="text-blue-600 hover:text-blue-700">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-700">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Download FishPeel */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">下載魚皮</h3>
            <div className="flex flex-col gap-2">
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                QR Code
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-6 bg-black rounded text-white text-xs flex items-center justify-center">
                  App Store
                </div>
                <div className="w-20 h-6 bg-green-600 rounded text-white text-xs flex items-center justify-center">
                  Google Play
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Login;
