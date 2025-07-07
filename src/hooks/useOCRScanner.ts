
import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

interface OCRResult {
  text: string;
  confidence: number;
}

interface UseOCRScannerReturn {
  isProcessing: boolean;
  error: string | null;
  scanDocument: (file: File) => Promise<OCRResult | null>;
  scanFromCamera: () => Promise<OCRResult | null>;
  clearError: () => void;
}

export function useOCRScanner(): UseOCRScannerReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (imageSource: File | string): Promise<OCRResult | null> => {
    try {
      setIsProcessing(true);
      setError(null);

      const worker = await createWorker('fra');
      const { data: { text, confidence } } = await worker.recognize(imageSource);
      await worker.terminate();

      return {
        text: text.trim(),
        confidence: Math.round(confidence)
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du traitement OCR';
      setError(errorMessage);
      console.error('OCR Error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const scanDocument = useCallback(async (file: File): Promise<OCRResult | null> => {
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image (JPG, PNG, etc.)');
      return null;
    }

    return processImage(file);
  }, [processImage]);

  const scanFromCamera = useCallback(async (): Promise<OCRResult | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      return new Promise((resolve, reject) => {
        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          ctx?.drawImage(video, 0, 0);
          
          stream.getTracks().forEach(track => track.stop());
          
          canvas.toBlob(async (blob) => {
            if (blob) {
              // Convert Blob to File to match the expected type
              const file = new File([blob], 'camera-capture.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              const result = await processImage(file);
              resolve(result);
            } else {
              reject(new Error('Impossible de capturer l\'image'));
            }
          }, 'image/jpeg', 0.8);
        });
      });
    } catch (err) {
      setError('Impossible d\'accéder à la caméra');
      return null;
    }
  }, [processImage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    error,
    scanDocument,
    scanFromCamera,
    clearError
  };
}
