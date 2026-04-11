import { useState, useCallback } from 'react';

export function useLineDrawing() {
  const [imageRefs, setImageRefs] = useState<{ [questionId: number]: HTMLImageElement | null }>({});
  const [labelRefs, setLabelRefs] = useState<{ [key: string]: HTMLDivElement | null }>({});

  const setImageRef = useCallback((questionId: number, el: HTMLImageElement | null) => {
    setImageRefs(prev => ({ ...prev, [questionId]: el }));
  }, []);

  const setLabelRef = useCallback((key: string, el: HTMLDivElement | null) => {
    setLabelRefs(prev => ({ ...prev, [key]: el }));
  }, []);

  const getImageRef = useCallback((questionId: number) => {
    return imageRefs[questionId];
  }, [imageRefs]);

  const getLabelRef = useCallback((key: string) => {
    return labelRefs[key];
  }, [labelRefs]);

  return {
    imageRefs,
    labelRefs,
    setImageRef,
    setLabelRef,
    getImageRef,
    getLabelRef
  };
}
