import React from 'react';
import { Image, StyleSheet, StyleProp, ImageStyle } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface KronosLogoProps {
  style?: StyleProp<ImageStyle>;
  size?: number;
}

/**
 * KronosLogo component that displays the appropriate logo based on the current theme
 */
const KronosLogo: React.FC<KronosLogoProps> = ({ style, size = 80 }) => {
  const { isDark } = useTheme();
  
  // Use the appropriate logo based on theme
  const logoPath = isDark 
    ? require('../assets/images/logos/logo-dark.png')
    : require('../assets/images/logos/logo-light.png');
  
  return (
    <Image
      source={logoPath}
      style={[
        styles.logo,
        { width: size, height: size },
        style
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
  },
});

export default KronosLogo;
