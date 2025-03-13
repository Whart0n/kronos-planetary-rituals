import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import { usePlanetaryStore } from '@/stores/planetaryStore';
import { useLocationStore } from '@/stores/locationStore';
import { useRitualStore } from '@/stores/ritualStore';
import Container from '@/components/ui/Container';
import Title from '@/components/ui/Title';
import DailyCard from '@/components/DailyCard';
import PlanetaryHourCard from '@/components/PlanetaryHourCard';
import { getPlanetaryDayRuler } from '@/utils/planetaryHours';
import { getPlanetById } from '@/constants/planets';
import type { Planet as AppPlanet } from '@/app/types/index';
import AboutPlanetCard from '@/components/AboutPlanetCard';
import TodaysRitualCard from '@/components/TodaysRitualCard';
import { AlertCircle } from 'lucide-react-native';
import LocationPrompt from '@/components/LocationPrompt';
import KronosLogo from '@/components/KronosLogo';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { fetchPlanetaryPositions, planetPositions } = usePlanetaryStore();
  const { location, hasPromptedForLocation, setHasPromptedForLocation } = useLocationStore();
  const { fetchRituals, fetchCompletedRituals, error } = useRitualStore();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  
  // Fetch data when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPlanetaryPositions();
        await fetchRituals();
        await fetchCompletedRituals();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
    
    // Show location prompt if not prompted before
    if (!hasPromptedForLocation) {
      setShowLocationPrompt(true);
    }
  }, [fetchPlanetaryPositions, fetchRituals, fetchCompletedRituals, hasPromptedForLocation]);
  
  // Get the day's ruling planet for rituals - with error handling
  const today = new Date(); // Use the actual current date
  const dayRulerPlanetId = getPlanetaryDayRuler(today);
  // Ensure the planet object has all required properties including ritual as a string
  const dayRulerPlanet = dayRulerPlanetId ? {
    ...getPlanetById(dayRulerPlanetId),
    // Ensure ritual is always a string (not undefined)
    ritual: getPlanetById(dayRulerPlanetId)?.ritual || ''
  } : null;
  
  // Find the current position of the day's ruling planet - with error handling
  const dayRulerPosition = dayRulerPlanetId && planetPositions && planetPositions.length > 0 
    ? planetPositions.find(p => p.planet.toLowerCase() === dayRulerPlanetId.toLowerCase()) 
    : null;
    
  console.log('Day ruler planet:', dayRulerPlanetId, 'Position:', dayRulerPosition);
  
  const handleLocationPromptClose = () => {
    setShowLocationPrompt(false);
    setHasPromptedForLocation(true);
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          {/* Kronos Logo - Centered and Prominent */}
          <View style={styles.logoContainer}>
            <KronosLogo size={120} />
          </View>
          
          {/* Daily Practice heading removed as requested */}
          
          {/* Error message if there's an error */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20` }]}>
              <AlertCircle size={20} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          )}
          
          {/* About Planet Card - Showing day's ruling planet - MOVED TO TOP */}
          <View style={styles.section}>
            <Title 
              title={`Today's Ruling Planet: ${dayRulerPlanet?.name || 'Sun'}`} 
              style={styles.sectionTitle}
            />
            {dayRulerPlanet && (
              <AboutPlanetCard 
                planet={dayRulerPlanet} 
                planetPosition={dayRulerPosition || undefined} 
              />
            )}
          </View>
          
          {/* Today's Ritual Card - Using day's ruling planet */}
          <View style={styles.section}>
            <Title 
              title={`${dayRulerPlanet?.name || 'Sun'} Ritual`}
              style={styles.sectionTitle}
            />
            {dayRulerPlanet && (
              <TodaysRitualCard 
                planet={dayRulerPlanet} 
                planetPosition={dayRulerPosition || undefined}
              />
            )}
          </View>
          
          <View style={styles.section}>
            <Title 
              title="Planetary Hours" 
              style={styles.sectionTitle}
            />
            <PlanetaryHourCard />
          </View>
        </Container>
      </ScrollView>
      
      {showLocationPrompt && (
        <LocationPrompt 
          visible={showLocationPrompt}
          onClose={handleLocationPromptClose}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 16,
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    marginTop: 16,
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});