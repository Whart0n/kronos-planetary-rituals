import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import Card from '@/components/ui/Card';
import PlanetSymbol from '@/components/ui/PlanetSymbol';
import { useRitualStore } from '@/stores/ritualStore';

// Define the Planet interface locally
interface Planet {
  id: string;
  name: string;
  day: string;
  color: string;
  candle: string;
  symbol: string;
  description: string;
  ritual: string;
}

// Define the PlanetPosition interface locally
interface PlanetPosition {
  planet: string;
  sign: string;
  isRetrograde: boolean;
}

interface TodaysRitualCardProps {
  planet: Planet;
  planetPosition?: PlanetPosition;
}

const TodaysRitualCard = ({ planet, planetPosition }: TodaysRitualCardProps) => {
  const router = useRouter();
  const { colors, currentDayTheme } = useTheme();
  const { completedRituals } = useRitualStore();
  
  // Check if this ritual has been completed today
  const isCompletedToday = completedRituals?.some(ritual => {
    const ritualDate = new Date(ritual.completedAt);
    const today = new Date();
    return (
      ritual.ritualId === planet.id &&
      ritualDate.getDate() === today.getDate() &&
      ritualDate.getMonth() === today.getMonth() &&
      ritualDate.getFullYear() === today.getFullYear()
    );
  });
  
  const handleStartRitual = () => {
    router.push(`/ritual/${planet.id}`);
  };
  
  return (
    <Card variant="elevated" withGradient={true}>
      <View style={styles.content}>
        <View style={styles.header}>
          <PlanetSymbol 
            planetId={planet.id}
            size={32} 
            color={colors[planet.id as keyof typeof colors]} 
            variant={isCompletedToday ? "glowing" : "default"}
          />
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {planet.name} Ritual
            </Text>
            {planetPosition && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {planetPosition.sign} {planetPosition.isRetrograde ? '℞' : ''}
              </Text>
            )}
          </View>
        </View>
        
        <Text style={[styles.description, { color: colors.text }]}>
          {planet.ritual}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Candle:
            </Text>
            <Text 
              style={[
                styles.detailValue, 
                { 
                  color: planet.candle.toLowerCase().includes('orange') ? '#FF8C00' : 
                         planet.candle.toLowerCase().includes('yellow') ? '#FFD700' : 
                         planet.candle.toLowerCase().includes('white') ? '#F0F0F0' : 
                         planet.candle.toLowerCase().includes('red') ? '#FF0000' : 
                         planet.candle.toLowerCase().includes('blue') ? '#4B0082' : 
                         planet.candle.toLowerCase().includes('purple') ? '#4B0082' : 
                         planet.candle.toLowerCase().includes('green') ? '#00FF00' : 
                         planet.candle.toLowerCase().includes('black') ? '#000000' : 
                         colors[planet.id] 
                }
              ]}>
              {planet.candle}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Day:
            </Text>
            <Text style={[styles.detailValue, { color: colors[planet.id as keyof typeof colors] }]}>
              {planet.day}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isCompletedToday ? colors.success : colors[planet.id as keyof typeof colors],
              opacity: isCompletedToday ? 0.8 : 1,
            },
          ]}
          onPress={handleStartRitual}
          disabled={isCompletedToday}
        >
          <Text style={styles.buttonText}>
            {isCompletedToday ? 'Completed Today' : 'Begin Ritual'}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'System',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'System',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    marginRight: 4,
    fontFamily: 'System',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'System',
  },
});

export default TodaysRitualCard;