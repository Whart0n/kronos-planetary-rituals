import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../components/ThemeProvider';
import { useLocationStore } from '../../stores/locationStore';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin } from 'lucide-react-native';
import { formatDate } from '../../utils/dateUtils';
import { getPlanetaryDayRuler, formatHourTime } from '../../utils/planetaryHours';
import { calculatePlanetaryHours } from '../services/planetaryHours';
import { getPlanetById } from '../../constants/planets';
import PlanetaryHourListItem from '../../components/PlanetaryHourListItem';
import LocationPrompt from '../../components/LocationPrompt';
import { PlanetaryHour } from '../../types';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { location } = useLocationStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planetaryHours, setPlanetaryHours] = useState<PlanetaryHour[]>([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the ruling planet for the selected date
  const dayRulerPlanetId = getPlanetaryDayRuler(selectedDate);
  const dayRulerPlanet = getPlanetById(dayRulerPlanetId);
  
  // Load planetary hours for the selected date
  useEffect(() => {
    async function fetchPlanetaryHours() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get timezone from system
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Use location if available, otherwise use default values
        const latitude = location?.latitude || 0;
        const longitude = location?.longitude || 0;
        
        // Calculate planetary hours using the accurate implementation
        const hours = await calculatePlanetaryHours(
          latitude,
          longitude,
          selectedDate,
          timezone
        );
        
        setPlanetaryHours(hours as PlanetaryHour[]);
      } catch (err) {
        console.error('Error getting planetary hours:', err);
        setError(err instanceof Error ? err.message : 'Failed to calculate planetary hours');
        setPlanetaryHours([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPlanetaryHours();
  }, [selectedDate, location]);
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };
  
  // Reset to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  // Check if selected date is today
  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };
  
  // Format location name
  const formatLocationName = () => {
    if (!location) return 'Location not set';
    
    if (location.name) {
      return location.name;
    } else if (location.latitude && location.longitude) {
      return `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
    } else {
      return 'Location not set';
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Planetary Hours
        </Text>
        
        <TouchableOpacity 
          style={[styles.locationButton, { backgroundColor: colors.card }]}
          onPress={() => setShowLocationPrompt(true)}
        >
          <MapPin size={16} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {formatLocationName()}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.calendarHeader, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={goToPreviousDay}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.dateContainer, { borderColor: colors.border }]}
          onPress={goToToday}
        >
          <CalendarIcon size={16} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {formatDate(selectedDate)}
          </Text>
          {!isToday() && (
            <TouchableOpacity 
              style={[styles.todayButton, { backgroundColor: colors.primary }]}
              onPress={goToToday}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={goToNextDay}
        >
          <ChevronRight size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.dayRulerContainer}>
        <Text style={[styles.dayRulerLabel, { color: colors.textSecondary }]}>
          Ruling Planet:
        </Text>
        <Text style={[styles.dayRulerValue, { color: dayRulerPlanet?.color || colors.primary }]}>
          {dayRulerPlanet?.name || 'Sun'}
        </Text>
      </View>
      
      {isLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Calculating planetary hours...
          </Text>
        </View>
      ) : error ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.errorText, { color: colors.error || '#ff3b30' }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // Force re-fetch
              setSelectedDate(new Date(selectedDate));
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {planetaryHours.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: colors.text }]}>
                No planetary hours data available
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Day Hours
                </Text>
                
                {planetaryHours
                  .filter(hour => hour.isDay)
                  .map((hour, index) => (
                    <PlanetaryHourListItem key={`day-${index}`} hour={hour} />
                  ))}
              </View>
              
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Night Hours
                </Text>
                
                {planetaryHours
                  .filter(hour => !hour.isDay)
                  .map((hour, index) => (
                    <PlanetaryHourListItem key={`night-${index}`} hour={hour} />
                  ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
      
      {showLocationPrompt && (
        <LocationPrompt 
          visible={showLocationPrompt}
          onClose={() => setShowLocationPrompt(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  navButton: {
    padding: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  todayButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayRulerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dayRulerLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  dayRulerValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});