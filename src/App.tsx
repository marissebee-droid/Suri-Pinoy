import { useState, useEffect } from 'react';
import { Scan, History, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ProductDetails } from './components/ProductDetails';
import { ScanHistory } from './components/ScanHistory';
import { fetchProduct, Product } from './utils/api';
import { productDB } from './utils/db';

function App() {
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    productDB.init();
    productDB.clearOldEntries();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.error('Service Worker registration failed:', err));
    }
  }, []);

  const handleScan = async (barcode: string) => {
    setShowScanner(false);
    setLoading(true);
    setError('');

    try {
      const product = await fetchProduct(barcode);
      if (product) {
        setSelectedProduct(product);
      } else {
        setError('Product not found in database');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Failed to fetch product data');
      setTimeout(() => setError(''), 3000);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptLTEyIDJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0yNCAyNGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZ6bS0xMiAyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="relative z-10">
        <header className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">SuriPinoy</h1>
                  <p className="text-emerald-100 text-sm">Philippine Food Scanner</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistory(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <History className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mb-4 bg-blue-50 border-2 border-blue-500 rounded-xl p-4 flex items-center gap-3 animate-slide-down">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
              <p className="text-blue-700 text-sm">Loading product data...</p>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl shadow-lg">
                <Scan className="w-12 h-12 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Scan Food Products
                </h2>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  Check for <span className="font-semibold text-emerald-600">Sangkap Pinoy Seal</span> and{' '}
                  <span className="font-semibold text-amber-600">DOH Warning Labels</span> instantly
                </p>
              </div>

              <button
                onClick={() => setShowScanner(true)}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
              >
                <Scan className="w-6 h-6" />
                Start Scanning
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="bg-emerald-50 rounded-2xl p-4">
                  <div className="text-emerald-600 font-bold text-2xl mb-1">📷</div>
                  <p className="text-sm font-semibold text-gray-900">Camera Scanner</p>
                  <p className="text-xs text-gray-600 mt-1">Point at any barcode</p>
                </div>
                <div className="bg-teal-50 rounded-2xl p-4">
                  <div className="text-teal-600 font-bold text-2xl mb-1">✅</div>
                  <p className="text-sm font-semibold text-gray-900">Sangkap Pinoy</p>
                  <p className="text-xs text-gray-600 mt-1">Local ingredients</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4">
                  <div className="text-amber-600 font-bold text-2xl mb-1">⚠️</div>
                  <p className="text-sm font-semibold text-gray-900">DOH Labels</p>
                  <p className="text-xs text-gray-600 mt-1">Health warnings</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400 p-2 rounded-lg flex-shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-900" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">About SuriPinoy</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  SuriPinoy helps Filipino consumers make informed food choices by instantly
                  identifying products with the Sangkap Pinoy Seal (local ingredients) and
                  displaying 2026 DOH Front-of-Package Warning Labels for high sugar and sodium content.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p>Data powered by Open Food Facts • Philippine DOH Guidelines 2026</p>
        </footer>
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showHistory && (
        <ScanHistory
          onSelectProduct={(product) => {
            setShowHistory(false);
            setSelectedProduct(product);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default App;
