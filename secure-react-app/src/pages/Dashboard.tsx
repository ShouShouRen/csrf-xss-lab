import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, getCsrfToken } from "../api";
import { useAuth } from "../context/AuthContext";

interface TransferResult {
  message: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, refreshCsrfToken } =
    useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferResult, setTransferResult] = useState<TransferResult | null>(
    null
  );
  const [transferError, setTransferError] = useState("");
  const [csrfTokenDisplay, setCsrfTokenDisplay] = useState("");

  useEffect(() => {
    // 未登入導向登入頁
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 更新顯示的 CSRF Token
  useEffect(() => {
    const token = getCsrfToken();
    setCsrfTokenDisplay(token || "尚未獲取");
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleRefreshCsrfToken = async () => {
    await refreshCsrfToken();
    const token = getCsrfToken();
    setCsrfTokenDisplay(token || "獲取失敗");
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError("");
    setTransferResult(null);
    setTransferLoading(true);

    if (!transferAmount || !toAccount) {
      setTransferError("請填寫轉帳金額和目標帳戶");
      setTransferLoading(false);
      return;
    }

    try {
      const result = await authApi.transfer(Number(transferAmount), toAccount);
      setTransferResult(result);
      setTransferAmount("");
      setToAccount("");
    } catch (err: any) {
      console.error("Transfer error:", err);
      if (err.response?.status === 403) {
        setTransferError("CSRF Token 驗證失敗！這可能是惡意請求。");
      } else {
        setTransferError(err.response?.data?.message || "轉帳失敗");
      }
    } finally {
      setTransferLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-blue-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue-200">
              賣家中心
            </a>
            <a href="#" className="hover:text-blue-200">
              下載
            </a>
            <div className="flex items-center gap-2">
              <span>追蹤我們</span>
              <a href="#" className="hover:text-blue-200">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-200">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-200 relative">
              通知總覽
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </a>
            <a href="#" className="hover:text-blue-200">
              幫助中心
            </a>
            <select className="bg-blue-600 text-white border-none outline-none cursor-pointer">
              <option>繁體中文</option>
            </select>
            <div className="flex items-center gap-2">
              <span>{user?.username || "使用者"}</span>
              <button onClick={handleLogout} className="hover:text-blue-200">
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Area */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 text-gray-900 ">
              <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-white">魚皮購物</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                placeholder="趕快看你的魚皮10週年回顧"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Shopping Cart */}
            <button className="relative text-gray-900 hover:text-blue-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                86
              </span>
            </button>
          </div>

          {/* Trending Searches */}
          <div className="mt-3 flex items-center gap-4 text-white text-sm">
            <span className="font-semibold">熱門搜尋：</span>
            <div className="flex gap-4 flex-wrap">
              <a href="#" className="hover:text-blue-500">
                Dyson 空氣清淨機
              </a>
              <a href="#" className="hover:text-blue-500">
                Cleanfit 外套
              </a>
              <a href="#" className="hover:text-blue-500">
                房間氣氛燈
              </a>
              <a href="#" className="hover:text-blue-500">
                底片相機
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Security Panel (可折疊) */}
      {showSecurityPanel && (
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CSRF Token 資訊 */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  CSRF 防護狀態
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">
                      當前 CSRF Token：
                    </p>
                    <code className="text-green-700 text-xs break-all block bg-green-50 p-2 rounded">
                      {csrfTokenDisplay}
                    </code>
                  </div>
                  <button
                    onClick={handleRefreshCsrfToken}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    刷新 CSRF Token
                  </button>
                </div>
              </div>

              {/* 模擬轉帳 */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  模擬轉帳（受 CSRF 保護）
                </h3>
                <form onSubmit={handleTransfer} className="space-y-3">
                  <input
                    type="text"
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    placeholder="目標帳戶"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="轉帳金額"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {transferError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                      {transferError}
                    </div>
                  )}
                  {transferResult && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
                      ✓ {transferResult.message} - ${transferResult.amount} 至{" "}
                      {transferResult.to}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={transferLoading}
                    className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {transferLoading ? "處理中..." : "執行轉帳"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Promotional Banners */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Main Banner (Left) */}
          <div className="col-span-2 relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg overflow-hidden p-6 text-white">
            <div className="absolute top-4 left-4 text-sm font-semibold">
              商城
            </div>
            <div className="mt-8">
              <h2 className="text-4xl font-bold mb-4">12/25商城92折起</h2>
              <div className="bg-blue-500 rounded-lg p-3 mb-4 inline-block">
                <div className="text-sm font-semibold">短影音簽到抽$10</div>
                <div className="text-xs mt-1">數量有限,先搶先贏</div>
              </div>
              <div className="flex gap-3 mb-4">
                <div className="bg-blue-700 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-2xl font-bold">F</span>
                  <span className="text-xl font-bold">$10</span>
                </div>
                <div className="bg-blue-700 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-2xl font-bold">F</span>
                  <span className="text-xl font-bold">92折</span>
                </div>
              </div>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                放心買安心退▶
              </button>
            </div>
          </div>

          {/* Right Banners */}
          <div className="space-y-4">
            {/* Top Right Banner */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg overflow-hidden p-4 text-white">
              <h3 className="text-xl font-bold mb-2">週日商城日95折</h3>
              <p className="text-sm mb-3">整點瘋搶5折券</p>
              <div className="flex gap-2 mb-3">
                <div className="bg-yellow-500 rounded-lg p-2 flex items-center gap-1">
                  <span className="font-bold">$</span>
                  <span className="font-bold">95折</span>
                </div>
                <div className="bg-blue-800 rounded-lg p-2 flex items-center gap-1">
                  <span className="font-bold">F</span>
                  <span className="font-bold">5折券</span>
                </div>
              </div>
              <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-50 transition-colors">
                放心買安心退▶
              </button>
            </div>

            {/* Bottom Right Banner */}
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-2">
                  FUJIFILM Value from Innovation
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  一機在手樂趣無窮
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs">
                  全館回饋5%魚幣 最高回饋魚幣5,000
                </div>
                <button className="mt-2 text-blue-600 text-xs font-semibold hover:text-blue-700">
                  放心買安心退▶
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Service Icons */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="grid grid-cols-10 gap-4">
            {[
              { icon: "🚚", text: "週六全站免運" },
              { icon: "📦", text: "$99起免運" },
              { icon: "⚡", text: "免運當日到!" },
              { icon: "🎫", text: "12.25優惠券" },
              { icon: "🏪", text: "魚皮商城" },
              { icon: "🌍", text: "魚皮海外直送" },
              { icon: "💳", text: "銀行刷卡優惠" },
              { icon: "💰", text: "天天超划算" },
              { icon: "📱", text: "魚皮3C家電" },
              { icon: "🎉", text: "活動合集" },
            ].map((service, index) => (
              <a
                key={index}
                href="#"
                className="flex flex-col items-center gap-2 hover:text-blue-500 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl hover:bg-blue-200 transition-colors">
                  {service.icon}
                </div>
                <span className="text-xs text-center">{service.text}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Brand Flagship Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">品牌旗艦</h2>
              <p className="text-sm">每週日搶商城95折券,最高折$1,500</p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              正品保障購安心
              <span>→</span>
              <span>逛逛去</span>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">商品圖片</span>
                </div>
                <div className="p-3">
                  <div className="text-sm text-gray-900 font-semibold mb-1">
                    品牌商品 {item}
                  </div>
                  <div className="text-blue-600 font-bold">$999</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex flex-col items-center justify-center text-white transition-colors">
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
          <span className="text-xs mt-1">聊聊</span>
        </button>
      </div>
    </div>
  );
}
