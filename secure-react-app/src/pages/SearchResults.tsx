import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const query = searchParams.get('q') || '';

    // 檢查登入狀態
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">載入中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="text-white hover:text-blue-200"
                        >
                            ← 返回
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                                <span className="text-blue-500 font-bold text-lg">F</span>
                            </div>
                            <span className="text-xl font-bold">魚皮購物</span>
                        </div>
                        {/* 安全標誌 */}
                        <div className="ml-auto flex items-center gap-1 bg-green-500 px-2 py-1 rounded text-xs">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            安全模式
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">搜尋結果</h2>
                {query ? (
                    <>
                        <p className="text-sm text-gray-600 mb-4">您搜尋了：</p>
                        {/* 安全版本：使用 textContent 而不是 dangerouslySetInnerHTML */}
                        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="text-gray-800 break-words">{query}</div>
                        </div>

                        {/* 安全提示 */}
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">安全版本：此頁面已防護 XSS 攻擊</span>
                            </div>
                            <p className="text-green-600 text-sm mt-2">
                                使用 React 的文字渲染而非 dangerouslySetInnerHTML，用戶輸入會被自動跳脫處理。
                            </p>
                        </div>

                        {/* Product Card */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow max-w-sm">
                            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">商品圖片</span>
                            </div>
                            <div className="p-4">
                                <div className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {query}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-blue-600 font-bold text-lg">$999</div>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                        加入購物車
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600">請輸入搜尋關鍵字</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;


