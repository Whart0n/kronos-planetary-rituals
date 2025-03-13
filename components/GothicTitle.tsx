import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface GothicTitleProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  variant?: 'default' | 'ritual' | 'parchment';
}

const GothicTitle = ({ title, subtitle, style, variant = 'default' }: GothicTitleProps) => {
  const { colors, isDark, currentDayTheme } = useTheme();
  
  // Get accent element based on the day's theme
  const getAccentElement = () => {
    if (!currentDayTheme || !currentDayTheme.motifs) return '✧';
    
    const accentElement = currentDayTheme.motifs.accentElement || '';
    
    if (accentElement.includes('sunflower')) return '✿';
    if (accentElement.includes('jasmine')) return '❀';
    if (accentElement.includes('dragon')) return '🔥';
    if (accentElement.includes('lavender')) return '❇';
    if (accentElement.includes('sage')) return '☘';
    if (accentElement.includes('rose')) return '✾';
    if (accentElement.includes('cypress')) return '🌲';
    
    return '✧';
  };
  
  const accentSymbol = getAccentElement();
  
  // Safely get primary color with fallback
  const primaryColor = currentDayTheme?.colors?.primary || colors.primary;
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[
        styles.title,
        { color: colors.text, textShadowColor: isDark ? `${colors.shadow}75` : 'transparent' },
        variant === 'ritual' && [
          styles.ritualTitle, 
          { 
            color: primaryColor, 
            textShadowColor: isDark ? `${colors.shadow}90` : 'transparent' 
          }
        ],
        variant === 'parchment' && [
          styles.parchmentTitle, 
          { 
            color: colors.inkStain, 
            textShadowColor: isDark ? `${colors.text}30` : 'transparent' 
          }
        ]
      ]}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={[
          styles.subtitle,
          { color: colors.textSecondary },
          variant === 'ritual' && [
            styles.ritualSubtitle, 
            { color: colors.textSecondary }
          ],
          variant === 'parchment' && [styles.parchmentSubtitle, { color: colors.runeEtch }]
        ]}>
          {subtitle}
        </Text>
      )}
      
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: `${colors.text}20` }]} />
        <Text style={[
          styles.dividerSymbol, 
          { color: primaryColor }
        ]}>
          {accentSymbol}
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: `${colors.text}20` }]} />
      </View>
      
      {/* Decorative drips */}
      <View style={[styles.drip, { backgroundColor: `${colors.text}20`, left: '30%', height: 8 }]} />
      <View style={[styles.drip, { backgroundColor: `${colors.text}20`, left: '70%', height: 12 }]} />
      <View style={[styles.drip, { backgroundColor: `${colors.text}20`, left: '45%', height: 6 }]} />
      
      {/* Decorative flourishes */}
      <Text style={[
        styles.flourishLeft, 
        { color: `${primaryColor}30` }
      ]}>❦</Text>
      <Text style={[
        styles.flourishRight, 
        { color: `${primaryColor}30` }
      ]}>❧</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ritualTitle: {
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  parchmentTitle: {
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontFamily: 'serif',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  ritualSubtitle: {},
  parchmentSubtitle: {},
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerSymbol: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  // Ink drip effect
  drip: {
    position: 'absolute',
    bottom: -2,
    width: 2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  // Decorative flourishes
  flourishLeft: {
    position: 'absolute',
    left: 0,
    top: '50%',
    fontSize: 16,
    transform: [{ translateY: -8 }],
  },
  flourishRight: {
    position: 'absolute',
    right: 0,
    top: '50%',
    fontSize: 16,
    transform: [{ translateY: -8 }],
  },
});

export default GothicTitle;