import { useState, useCallback } from 'react';

export function useMediaUpload() {
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: File }>({});

  const uploadImage = useCallback((key: string, file: File) => {
    setUploadedImages(prev => ({ ...prev, [key]: file }));
  }, []);

  const removeImage = useCallback((key: string) => {
    setUploadedImages(prev => {
      const newImages = { ...prev };
      delete newImages[key];
      return newImages;
    });
  }, []);

  const getImage = useCallback((key: string) => {
    return uploadedImages[key];
  }, [uploadedImages]);

  const clearAll = useCallback(() => {
    setUploadedImages({});
  }, []);

  return {
    uploadedImages,
    uploadImage,
    removeImage,
    getImage,
    clearAll,
    uploadedCount: Object.keys(uploadedImages).length
  };
}
