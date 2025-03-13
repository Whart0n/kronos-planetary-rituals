import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/components/ThemeProvider';
import { useProfileStore } from '@/stores/profileStore';

interface ProfileAvatarProps {
  size?: number;
  uri?: string;
  name?: string;
}

const ProfileAvatar = ({ size = 60, uri, name }: ProfileAvatarProps) => {
  const { profile } = useProfileStore();
  const { colors, currentDayTheme } = useTheme();
  
  // Use provided name or fall back to profile name
  const displayName = name || profile?.name || '';
  
  // Get initials from name
  const getInitials = () => {
    if (!displayName) return '';
    
    const names = displayName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  const initials = getInitials();
  
  // Use provided URI or fall back to profile avatar
  const avatarUri = uri || profile?.avatar_url;
  
  return (
    <View style={[styles.outerContainer, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
      <LinearGradient
        colors={[currentDayTheme?.colors?.primary || colors.primary, currentDayTheme?.colors?.secondary || colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 }
        ]}
      >
        {avatarUri ? (
          <Image 
            source={{ uri: avatarUri }}
            style={[
              styles.image,
              { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }
            ]}
          />
        ) : initials ? (
          <Text style={[styles.initials, { fontSize: size * 0.4, fontFamily: 'System' }]}>
            {initials}
          </Text>
        ) : (
          <View style={styles.iconContainer}>
            <User size={size * 0.5} color={colors.text} />
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF20',
    padding: 2,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  iconContainer: {
    backgroundColor: '#FFFFFF20',
    width: '80%',
    height: '80%',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ProfileAvatar;