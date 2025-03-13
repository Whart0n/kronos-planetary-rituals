import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { getZodiacSymbol } from '@/constants/dignities';

interface PlanetaryDignityProps {
  dignity: string | null;
  sign: string;
  isRetrograde?: boolean;
  onPress?: () => void;
}

const PlanetaryDignity: React.FC<PlanetaryDignityProps> = ({
  dignity,
  sign,
  isRetrograde = false,
  onPress,
}) => {
  const { colors } = useTheme();
  
  if (!dignity) return null;
  
  // Get color based on dignity
  const getDignityColor = (dignityType: string): string => {
    switch (dignityType) {
      case 'Domicile':
        return '#4CAF50'; // Green
      case 'Exaltation':
        return '#2196F3'; // Blue
      case 'Detriment':
        return '#FF9800'; // Orange
      case 'Fall':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey for peregrine
    }
  };
  
  // Get zodiac symbol
  const zodiacSymbol = getZodiacSymbol(sign);
  
  const dignityColor = getDignityColor(dignity);
  
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: dignityColor }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.dignityBadge, { backgroundColor: dignityColor }]}>
        <Text style={[styles.dignityText, { color: '#FFFFFF', fontFamily: 'System' }]}>
          {dignity}
        </Text>
      </View>
      
      <View style={styles.signContainer}>
        <Text style={[styles.signSymbol, { color: colors.text, fontFamily: 'System' }]}>
          {zodiacSymbol}
        </Text>
        <Text style={[styles.signName, { color: colors.text, fontFamily: 'System' }]}>
          {sign}
        </Text>
        {isRetrograde && (
          <Text style={[styles.retrograde, { color: colors.error, fontFamily: 'System' }]}>
            ℞
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    backgroundColor: 'transparent',
  },
  dignityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  dignityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  signContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signSymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  signName: {
    fontSize: 14,
  },
  retrograde: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default PlanetaryDignity;