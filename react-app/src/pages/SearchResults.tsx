import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';

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
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">搜尋結果</h2>
                {query ? (
                    <>
                        <p className="text-sm text-gray-600 mb-4">您搜尋了：</p>
                        {/* VULNERABILITY: Rendering user input directly as HTML - XSS Attack */}
                        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                            <div dangerouslySetInnerHTML={{ __html: query }} />
                        </div>

                        {/* Product Card */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow max-w-sm">
                            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">商品圖片</span>
                            </div>
                            <div className="p-4">
                                <div 
                                    className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: query }} 
                                />
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

