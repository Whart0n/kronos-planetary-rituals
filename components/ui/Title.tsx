import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface TitleProps {
  title?: string;
  subtitle?: string;
  text?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const Title = ({ 
  title, 
  subtitle, 
  text,
  align = 'left', 
  size = 'medium',
  style 
}: TitleProps) => {
  const { colors, currentDayTheme } = useTheme();
  
  // Use text prop as title if title is not provided
  const titleText = title || text || '';
  
  // Get title styles based on size
  const getTitleStyles = () => {
    const baseStyles = {
      color: colors.text,
      fontFamily: currentDayTheme?.typography?.titleFont || 'System',
      textAlign: align as any,
    };
    
    switch (size) {
      case 'small':
        return {
          ...baseStyles,
          fontSize: 18,
          fontWeight: '600' as const,
        };
      case 'large':
        return {
          ...baseStyles,
          fontSize: 28,
          fontWeight: 'bold' as const,
          letterSpacing: 0.5,
        };
      case 'medium':
      default:
        return {
          ...baseStyles,
          fontSize: 22,
          fontWeight: 'bold' as const,
        };
    }
  };
  
  // Get subtitle styles
  const getSubtitleStyles = () => {
    return {
      color: colors.textSecondary,
      fontFamily: currentDayTheme?.typography?.bodyFont || 'System',
      fontSize: size === 'large' ? 16 : 14,
      textAlign: align as any,
    };
  };
  
  const titleStyles = getTitleStyles();
  const subtitleStyles = getSubtitleStyles();
  
  return (
    <View style={[
      styles.container, 
      { alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' },
      style
    ]}>
      <Text style={titleStyles}>{titleText}</Text>
      {subtitle && <Text style={subtitleStyles}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});

export default Title;