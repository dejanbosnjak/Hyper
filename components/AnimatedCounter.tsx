import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';

interface AnimatedCounterProps {
  value: string;
  style?: any;
  duration?: number;
}

export default function AnimatedCounter({ value, style, duration = 2000 }: AnimatedCounterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Extract numeric value for animation
  const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: numericValue,
      duration,
      useNativeDriver: false,
    }).start();
  }, [numericValue, duration]);

  if (value.includes('%')) {
    return (
      <Animated.Text style={style}>
        {animatedValue.interpolate({
          inputRange: [0, numericValue],
          outputRange: ['0%', value],
          extrapolate: 'clamp',
        })}
      </Animated.Text>
    );
  }

  if (value.includes('K')) {
    return (
      <Animated.Text style={style}>
        {animatedValue.interpolate({
          inputRange: [0, numericValue],
          outputRange: ['0K+', value],
          extrapolate: 'clamp',
        })}
      </Animated.Text>
    );
  }

  return <Text style={style}>{value}</Text>;
}