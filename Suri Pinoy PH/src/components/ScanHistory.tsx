import { useEffect, useState } from 'react';
import { History, Package, X } from 'lucide-react';
import { productDB, CachedProduct } from '../utils/db';
import { Product } from '../utils/api';

interface ScanHistoryProps {
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
}

export function ScanHistory({ onSelectProduct, onClose }: ScanHistoryProps) {
  const [history, setHistory] = useState<CachedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const products = await productDB.getAllProducts();
      setHistory(products);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="w-6 h-6" />
            Recent Scans
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No scanned products yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start scanning to see your history here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const product = item.data as Product;
                return (
                  <button
                    key={item.barcode}
                    onClick={() => onSelectProduct(product)}
                    className="w-full bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.product_name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {product.product_name || 'Unknown Product'}
                      </h3>
                      {product.brands && (
                        <p className="text-sm text-emerald-600 line-clamp-1">
                          {product.brands}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
