import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWindows = Platform.OS === 'windows';
export const isMobile = isIOS || isAndroid;
export const isDesktop = isWeb || isWindows;

export const platformSelect = <T>(options: {
  web?: T;
  ios?: T;
  android?: T;
  windows?: T;
  mobile?: T;
  desktop?: T;
  default?: T;
}): T | undefined => {
  if (isWindows && options.windows) return options.windows;
  if (isWeb && options.web) return options.web;
  if (isIOS && options.ios) return options.ios;
  if (isAndroid && options.android) return options.android;
  if (isMobile && options.mobile) return options.mobile;
  if (isDesktop && options.desktop) return options.desktop;
  return options.default;
};

export const getResponsiveValue = (mobile: number, desktop: number): number => {
  return isDesktop ? desktop : mobile;
};