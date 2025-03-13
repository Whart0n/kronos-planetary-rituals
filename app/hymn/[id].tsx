import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { hymns } from '@/constants/hymns';
import Container from '@/components/ui/Container';
import PlanetSymbol from '@/components/ui/PlanetSymbol';
import { getPlanetById } from '@/constants/planets';

export default function HymnScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  // Find the hymn by ID
  const hymnId = Array.isArray(id) ? id[0] : id || '';
  const hymn = hymns.find(h => h.id === hymnId || h.planetId === hymnId);
  
  // Get the associated planet
  const planet = hymn ? getPlanetById(hymn.planetId) : null;
  
  if (!hymn || !planet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Container>
          <View style={styles.errorContainer}>
            <Text style={{ color: colors.text, fontFamily: 'System' }}>
              Hymn not found
            </Text>
            <TouchableOpacity 
              style={[styles.backButton, { borderColor: colors.border }]}
              onPress={() => router.back()}
            >
              <Text style={{ color: colors.primary, fontFamily: 'System' }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </Container>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Container>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={16} color={colors.text} />
            <Text style={[styles.backText, { color: colors.text, fontFamily: 'System' }]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.titleContainer}>
          <View style={[
            styles.symbolContainer,
            { backgroundColor: planet.color + '20' }
          ]}>
            <PlanetSymbol 
              planetId={planet.id}
              size={32}
              color={planet.color}
              variant="glowing"
            />
          </View>
          
          <View style={styles.titleTextContainer}>
            <Text style={[styles.title, { color: colors.text, fontFamily: 'System' }]}>
              {hymn.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text, fontFamily: 'System' }]}>
              Orphic Hymn to {hymn.title.includes('(') ? hymn.title.split('(')[0].trim() : planet.name}
            </Text>
          </View>
        </View>
        
        <View style={styles.hymnContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
          >
            <Text style={[styles.hymnText, { color: colors.text, fontFamily: 'System' }]}>
              {hymn.text}
            </Text>
          </ScrollView>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoTitle, { color: colors.text, fontFamily: 'System' }]}>
            About This Hymn
          </Text>
          <Text style={[styles.infoText, { color: colors.text, fontFamily: 'System' }]}>
            {hymn.description || `This Orphic Hymn is dedicated to ${planet.name}, and was traditionally used in rituals to invoke the planet's energy. The Orphic Hymns are a collection of 87 hexametric poems composed in the late Hellenistic era.`}
          </Text>
        </View>
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  backText: {
    marginLeft: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  symbolContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  hymnContainer: {
    flex: 1,
    marginBottom: 24,
    maxHeight: 400, // Set a maximum height to ensure scrollability
  },
  scrollView: {
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scrollContent: {
    padding: 16,
  },
  hymnText: {
    fontSize: 18,
    lineHeight: 28,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});