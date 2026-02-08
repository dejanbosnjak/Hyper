import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { isDesktop } from '@/utils/platform';

interface ResponsiveDimensions {
  width: number;
  height: number;
  isTablet: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  orientation: 'portrait' | 'landscape';
}

export function useResponsiveDimensions(): ResponsiveDimensions {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      isTablet: width >= 768 && width < 1024,
      isDesktop: isDesktop || width >= 1024,
      isMobile: width < 768,
      orientation: width > height ? 'landscape' : 'portrait' as 'portrait' | 'landscape',
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      setDimensions({
        width,
        height,
        isTablet: width >= 768 && width < 1024,
        isDesktop: isDesktop || width >= 1024,
        isMobile: width < 768,
        orientation: width > height ? 'landscape' : 'portrait',
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
}