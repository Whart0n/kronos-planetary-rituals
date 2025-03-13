import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface ContainerProps {
  children: ReactNode;
  withPattern?: boolean;
  style?: any;
}

const Container = ({ 
  children, 
  withPattern = false, 
  style 
}: ContainerProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.background },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default Container;