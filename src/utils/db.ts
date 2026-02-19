const DB_NAME = 'SuriPinoyDB';
const DB_VERSION = 1;
const STORE_NAME = 'products';

export interface CachedProduct {
  barcode: string;
  data: any;
  timestamp: number;
}

class ProductDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'barcode' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async getProduct(barcode: string): Promise<CachedProduct | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(barcode);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as CachedProduct | undefined;
        if (result) {
          const dayInMs = 24 * 60 * 60 * 1000;
          if (Date.now() - result.timestamp < dayInMs) {
            resolve(result);
          } else {
            this.deleteProduct(barcode);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
    });
  }

  async saveProduct(barcode: string, data: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const product: CachedProduct = {
        barcode,
        data,
        timestamp: Date.now(),
      };
      const request = objectStore.put(product);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteProduct(barcode: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(barcode);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getAllProducts(): Promise<CachedProduct[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const products = (request.result as CachedProduct[]).sort(
          (a, b) => b.timestamp - a.timestamp
        );
        resolve(products);
      };
    });
  }

  async clearOldEntries(): Promise<void> {
    if (!this.db) await this.init();

    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - weekInMs;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const index = objectStore.index('timestamp');
      const request = index.openCursor();

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const product = cursor.value as CachedProduct;
          if (product.timestamp < cutoffTime) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

export const productDB = new ProductDB();
