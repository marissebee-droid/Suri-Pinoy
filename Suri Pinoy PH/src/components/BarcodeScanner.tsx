import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    const startScanning = async () => {
      try {
        setIsScanning(true);
        const videoInputDevices = await reader.listVideoInputDevices();

        if (videoInputDevices.length === 0) {
          setError('No camera found on this device');
          return;
        }

        const selectedDeviceId = videoInputDevices[videoInputDevices.length - 1]?.deviceId;

        await reader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              const barcode = result.getText();
              console.log('Barcode detected:', barcode);
              onScan(barcode);
            }
            if (err && err.name !== 'NotFoundException') {
              console.error('Scan error:', err);
            }
          }
        );
      } catch (err) {
        console.error('Camera error:', err);
        setError('Unable to access camera. Please grant camera permissions.');
        setIsScanning(false);
      }
    };

    startScanning();

    return () => {
      reader.reset();
      setIsScanning(false);
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scan Barcode
          </h2>
          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {error ? (
          <div className="text-white text-center px-4">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Close Scanner
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-emerald-400 rounded-lg shadow-lg relative">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-10">
        <p className="text-white text-center text-sm">
          {isScanning ? 'Position barcode within the frame' : 'Starting camera...'}
        </p>
      </div>
    </div>
  );
}
