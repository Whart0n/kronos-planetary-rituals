import { DateTime } from 'luxon';
import { calculatePlanetaryHours } from '../app/services/planetaryHours';

/**
 * Test script to verify planetary hours calculation with UI-friendly output
 */
async function testPlanetaryHoursUI() {
  console.log('='.repeat(50));
  console.log('PLANETARY HOURS CALCULATION TEST');
  console.log('='.repeat(50));
  
  // Test location: Monticello, UT
  const latitude = 37.8714;
  const longitude = -109.3425;
  
  // Test date: March 7, 2025
  const date = new Date('2025-03-07T17:20:25-07:00');
  const timezone = 'America/Denver';
  
  console.log(`Location: Monticello, UT (${latitude}, ${longitude})`);
  console.log(`Date: ${date.toLocaleDateString()}`);
  console.log(`Time: ${date.toLocaleTimeString()}`);
  console.log(`Timezone: ${timezone}`);
  console.log('-'.repeat(50));
  
  try {
    // Calculate planetary hours
    const planetaryHours = await calculatePlanetaryHours(latitude, longitude, date, timezone);
    
    if (planetaryHours.length === 0) {
      console.log('No planetary hours calculated. Check for errors above.');
      return;
    }
    
    // Display all planetary hours in a formatted table
    console.log('\nPLANETARY HOURS FOR THE DAY:');
    console.log('-'.repeat(50));
    console.log('| Hour | Planet  | Start Time | End Time   | Type     |');
    console.log('|------|---------|------------|------------|----------|');
    
    planetaryHours.forEach((hour) => {
      const startTime = DateTime.fromJSDate(hour.startTime).toFormat('HH:mm');
      const endTime = DateTime.fromJSDate(hour.endTime).toFormat('HH:mm');
      const hourType = hour.isDayHour ? 'Day Hour' : 'Night Hour';
      
      console.log(
        `| ${hour.hourNumber.toString().padEnd(4)} | ${hour.planet.padEnd(7)} | ${startTime.padEnd(10)} | ${endTime.padEnd(10)} | ${hourType.padEnd(8)} |`
      );
    });
    
    // Find current planetary hour
    const now = date.getTime();
    const currentHour = planetaryHours.find(
      (hour) => now >= hour.startTime.getTime() && now < hour.endTime.getTime()
    );
    
    console.log('\nCURRENT PLANETARY HOUR:');
    console.log('-'.repeat(50));
    
    if (currentHour) {
      const startTime = DateTime.fromJSDate(currentHour.startTime).toFormat('HH:mm');
      const endTime = DateTime.fromJSDate(currentHour.endTime).toFormat('HH:mm');
      const hourType = currentHour.isDayHour ? 'Day Hour' : 'Night Hour';
      
      console.log(`Planet: ${currentHour.planet.toUpperCase()}`);
      console.log(`Hour Number: ${currentHour.hourNumber}`);
      console.log(`Time Range: ${startTime} - ${endTime}`);
      console.log(`Type: ${hourType}`);
    } else {
      console.log('Could not determine current planetary hour.');
    }
    
  } catch (error) {
    console.error('Error testing planetary hours:', error);
  }
}

// Run the test
testPlanetaryHoursUI();
