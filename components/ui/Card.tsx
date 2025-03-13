import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../components/ThemeProvider';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  title?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  color?: string;
  withGradient?: boolean;
}

const Card = ({ 
  children, 
  style, 
  title, 
  variant = 'default',
  color,
  withGradient = false
}: CardProps) => {
  const { colors, currentDayTheme } = useTheme();
  
  // Get card styles based on variant
  const getCardStyles = () => {
    const baseStyles: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: currentDayTheme?.ui?.cardBorderRadius || 16,
      overflow: 'hidden',
    };
    
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
    return (
      <View style={[cardStyles, style]}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </View>
    );
  }
  
  return (
    <View style={[cardStyles, style]}>
      {renderContent()}
    </View>
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