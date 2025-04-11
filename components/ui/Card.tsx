import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, ViewStyle, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../components/ThemeProvider';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  title?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  color?: string;
  withGradient?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

const Card = ({ 
  children, 
  style, 
  title, 
  variant = 'default',
  color,
  withGradient = false,
  onPress,
  accessibilityLabel
}: CardProps) => {
  const { colors, currentDayTheme } = useTheme();
  
  // Get card styles based on variant
  const getCardStyles = () => {
    const baseStyles: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: currentDayTheme?.ui?.cardBorderRadius || 16,
      overflow: 'hidden',
    };
    
    // Add web-specific styles for better mobile experience
    if (Platform.OS === 'web') {
      Object.assign(baseStyles, {
        // @ts-ignore - these are web-specific properties
        WebkitTapHighlightColor: 'transparent',
        cursor: onPress ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
      });
    }
    
    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 3,
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: color || colors.border,
          backgroundColor: 'transparent',
        };
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: color || colors.primary,
        };
      default:
        return baseStyles;
    }
  };
  
  const cardStyles = getCardStyles();
  
  // Render card content
  const renderContent = () => {
    return (
      <>
        {title && (
          <View style={styles.titleContainer}>
            <Text style={[
              styles.title, 
              { 
                color: variant === 'filled' ? colors.text : colors.text,
                fontFamily: currentDayTheme?.typography?.titleFont || 'system',
              }
            ]}>
              {title}
            </Text>
          </View>
        )}
        <View style={styles.content}>
          {children}
        </View>
      </>
    );
  };
  
  // Render card with or without gradient
  if (withGradient) {
    // Define default gradient colors if theme doesn't provide them
    const gradientColors = [
      currentDayTheme?.colors?.gradientStart || colors.background,
      currentDayTheme?.colors?.gradientMiddle || colors.card,
      currentDayTheme?.colors?.gradientEnd || colors.background
    ] as readonly [string, string, string];
    
    return (
      <View style={[cardStyles, style]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </View>
    );
  }
  
  // Determine if we should use TouchableOpacity or View based on onPress prop
  const CardComponent = onPress ? TouchableOpacity : View;
  const cardProps = onPress ? {
    onPress,
    activeOpacity: 0.9,
    accessibilityRole: "button" as const, // Type as const to match AccessibilityRole
    accessibilityLabel: accessibilityLabel || title,
  } : {};
  
  return (
    <CardComponent 
      style={[cardStyles, style]}
      {...cardProps}
    >
      {renderContent()}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
});

export default Card;