import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { getPlanetById } from '@/constants/planets';

interface CandleAnimationProps {
  color: string;
  size?: 'small' | 'medium' | 'large';
  planetId?: string;
}

const CandleAnimation = ({ color, size = 'medium', planetId = 'sun' }: CandleAnimationProps) => {
  const { currentDayTheme, colors } = useTheme();
  
  // Size multiplier based on size prop
  const sizeMultiplier = size === 'small' ? 0.7 : size === 'large' ? 1.3 : 1;
  
  // Animation values
  const flameScale = useRef(new Animated.Value(0.8)).current;
  const flameTranslateY = useRef(new Animated.Value(0)).current;
  const flameRotate = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.7)).current;
  
  // Get candle color based on planet
  const getCandleColor = () => {
    // Get the planet's candle color from the planet constants
    const planet = getPlanetById(planetId as any);
    
    // Map candle color names to actual color values
    const candleColorMap: Record<string, string> = {
      'Yellow': '#FFD700',
      'White': '#F0F0F0',
      'Red': '#FF0000',
      'Orange': '#FF8C00',
      'Blue or Purple': '#4B0082',
      'Green': '#00FF00',
      'Black': '#000000',
    };
    
    // Use the candle color from the planet definition
    if (planet && planet.candle) {
      const colorKey = planet.candle.split(' ')[0]; // Take the first color if multiple are specified
      return candleColorMap[colorKey] || planet.color || (planetId && colors[planetId as keyof typeof colors]) || '#F5F5F5';
    }
    
    // Fallback to planet's theme color
    return (planetId && colors[planetId as keyof typeof colors]) || '#F5F5F5';
  };
  
  // Animation speed based on day theme
  const getAnimationDuration = (baseDuration: number) => {
    // Default to normal speed (factor of 1)
    const speedFactor = 1;
    return baseDuration * speedFactor;
  };
  
  useEffect(() => {
    // Flame animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(flameScale, {
            toValue: 1.1,
            duration: getAnimationDuration(1000),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(flameTranslateY, {
            toValue: -3,
            duration: getAnimationDuration(1000),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(flameRotate, {
            toValue: 0.05,
            duration: getAnimationDuration(800),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(flameScale, {
            toValue: 0.8,
            duration: getAnimationDuration(1000),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(flameTranslateY, {
            toValue: 0,
            duration: getAnimationDuration(1000),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(flameRotate, {
            toValue: -0.05,
            duration: getAnimationDuration(800),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
    
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.9,
          duration: getAnimationDuration(1500),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: getAnimationDuration(1500),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);
  
  const spin = flameRotate.interpolate({
    inputRange: [-0.05, 0.05],
    outputRange: ['-5deg', '5deg'],
  });
  
  // Get the candle color based on the planet
  const candleColor = getCandleColor();
  
  return (
    <View style={[styles.container, { height: 200 * sizeMultiplier }]}>
      {/* Candle glow */}
      <Animated.View 
        style={[
          styles.glow,
          { 
            backgroundColor: color,
            opacity: glowOpacity,
            width: 80 * sizeMultiplier,
            height: 80 * sizeMultiplier,
            borderRadius: 40 * sizeMultiplier,
          }
        ]}
      />
      
      {/* Candle */}
      <View 
        style={[
          styles.candle,
          {
            backgroundColor: candleColor,
            width: 30 * sizeMultiplier,
            height: 120 * sizeMultiplier,
            borderRadius: 15 * sizeMultiplier,
          }
        ]}
      >
        {/* Wick */}
        <View 
          style={[
            styles.wick,
            {
              backgroundColor: '#333',
              width: 2 * sizeMultiplier,
              height: 15 * sizeMultiplier,
              top: -15 * sizeMultiplier,
            }
          ]}
        />
        
        {/* Flame */}
        <Animated.View 
          style={[
            styles.flame,
            {
              backgroundColor: '#FF9D00',
              width: 16 * sizeMultiplier,
              height: 30 * sizeMultiplier,
              borderRadius: 8 * sizeMultiplier,
              top: -30 * sizeMultiplier,
              transform: [
                { scale: flameScale },
                { translateY: flameTranslateY },
                { rotate: spin }
              ]
            }
          ]}
        >
          {/* Inner flame */}
          <View 
            style={[
              styles.innerFlame,
              {
                backgroundColor: '#FFFF00',
                width: 8 * sizeMultiplier,
                height: 15 * sizeMultiplier,
                borderRadius: 4 * sizeMultiplier,
              }
            ]}
          />
        </Animated.View>
        
        {/* Candle top */}
        <View 
          style={[
            styles.candleTop,
            {
              backgroundColor: candleColor,
              width: 30 * sizeMultiplier,
              height: 10 * sizeMultiplier,
              borderRadius: 15 * sizeMultiplier,
              top: -5 * sizeMultiplier,
            }
          ]}
        />
      </View>
      
      {/* Candle holder */}
      <View 
        style={[
          styles.holder,
          {
            backgroundColor: '#555',
            width: 40 * sizeMultiplier,
            height: 10 * sizeMultiplier,
            borderRadius: 5 * sizeMultiplier,
          }
        ]}
      />
      <View 
        style={[
          styles.holderBase,
          {
            backgroundColor: '#444',
            width: 50 * sizeMultiplier,
            height: 5 * sizeMultiplier,
            borderRadius: 2 * sizeMultiplier,
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 20,
    opacity: 0.5,
    zIndex: 0,
  },
  candle: {
    position: 'relative',
    zIndex: 1,
  },
  candleTop: {
    position: 'absolute',
    left: 0,
  },
  wick: {
    position: 'absolute',
    left: '50%',
    marginLeft: -1,
  },
  flame: {
    position: 'absolute',
    left: '50%',
    marginLeft: -8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  innerFlame: {
    position: 'absolute',
    top: 5,
  },
  holder: {
    marginTop: 5,
  },
  holderBase: {
    marginTop: 2,
  },
});

export default CandleAnimation;