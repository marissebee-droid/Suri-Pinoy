import { X, AlertTriangle, ShieldCheck, Package } from 'lucide-react';
import { Product, hasSangkapPinoyLabel, hasHighSugar, hasHighSodium, isPhilippineProduct } from '../utils/api';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const sangkapPinoy = hasSangkapPinoyLabel(product);
  const highSugar = hasHighSugar(product);
  const highSodium = hasHighSodium(product);
  const isLocal = isPhilippineProduct(product);

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {product.image_front_url && (
            <div className="w-full bg-gray-50 flex items-center justify-center p-8">
              <img
                src={product.image_front_url}
                alt={product.product_name || 'Product'}
                className="max-h-64 object-contain rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.product_name || 'Unknown Product'}
              </h3>
              {product.brands && (
                <p className="text-emerald-600 font-semibold text-lg">{product.brands}</p>
              )}
            </div>

            {(sangkapPinoy || isLocal) && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-emerald-900 text-lg mb-1">
                      {sangkapPinoy ? 'Sangkap Pinoy Seal' : 'Philippine Product'}
                    </h4>
                    <p className="text-emerald-700 text-sm">
                      {sangkapPinoy
                        ? 'This product uses locally-sourced Filipino ingredients'
                        : 'Manufactured in the Philippines'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(highSugar || highSodium) && (
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  DOH Front-of-Package Warning Labels (2026)
                </h4>

                {highSugar && (
                  <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500 px-3 py-1 rounded-lg">
                        <span className="text-white font-bold text-sm">HIGH SUGAR</span>
                      </div>
                      <p className="text-amber-900 text-sm flex-1">
                        Contains {product.nutriments?.sugars_100g?.toFixed(1)}g sugar per 100g
                      </p>
                    </div>
                  </div>
                )}

                {highSodium && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500 px-3 py-1 rounded-lg">
                        <span className="text-white font-bold text-sm">HIGH SODIUM</span>
                      </div>
                      <p className="text-red-900 text-sm flex-1">
                        Contains {((product.nutriments?.sodium_100g || 0) * 1000).toFixed(0)}mg sodium per 100g
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-600 italic">
                  As per Philippine DOH Administrative Order 2024-0014
                </p>
              </div>
            )}

            {product.nutriments && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Nutrition Facts (per 100g)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {product.nutriments['energy-kcal_100g'] && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Energy</p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.nutriments['energy-kcal_100g']} kcal
                      </p>
                    </div>
                  )}
                  {product.nutriments.fat_100g !== undefined && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Fat</p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.nutriments.fat_100g.toFixed(1)}g
                      </p>
                    </div>
                  )}
                  {product.nutriments.carbohydrates_100g !== undefined && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Carbohydrates</p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.nutriments.carbohydrates_100g.toFixed(1)}g
                      </p>
                    </div>
                  )}
                  {product.nutriments.proteins_100g !== undefined && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Protein</p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.nutriments.proteins_100g.toFixed(1)}g
                      </p>
                    </div>
                  )}
                  {product.nutriments.sugars_100g !== undefined && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Sugars</p>
                      <p className={`text-lg font-bold ${highSugar ? 'text-amber-600' : 'text-gray-900'}`}>
                        {product.nutriments.sugars_100g.toFixed(1)}g
                      </p>
                    </div>
                  )}
                  {product.nutriments.sodium_100g !== undefined && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Sodium</p>
                      <p className={`text-lg font-bold ${highSodium ? 'text-red-600' : 'text-gray-900'}`}>
                        {(product.nutriments.sodium_100g * 1000).toFixed(0)}mg
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {product.ingredients_text && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Ingredients</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.ingredients_text}
                </p>
              </div>
            )}

            {product.categories && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {product.categories.split(',').map((cat, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                    >
                      {cat.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
