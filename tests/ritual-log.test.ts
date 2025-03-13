import { supabase } from '../config/supabase';

type RitualLog = {
  id: string;
  user_id: string;
  ritual_id: string;
  completed_at: string;
  notes?: string;
  rating: number;
  created_at: string;
};

type InsertRitualLog = Omit<RitualLog, 'id' | 'user_id' | 'created_at'>;

async function testRitualLogging() {
  try {
    console.log('Testing ritual logging...');
    
    // Sign in with existing user
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'mpwharton@gmail.com',
      password: process.env.USER_PASSWORD || ''
    });
    
    if (signInError || !session) {
      console.log('\n❌ Authentication failed:', signInError?.message || 'No session');
      console.log('Please provide the password via USER_PASSWORD environment variable');
      throw new Error('Authentication failed');
    }
    
    console.log('✅ Authenticated successfully as:', session.user.email);
    console.log('Attempting to log ritual...');
    
    

    
    // Add the ritual log directly using Supabase
    const { data: addedLog, error: addError } = await supabase
      .from('ritual_logs')
      .insert({
        user_id: session.user.id,
        ritual_id: 'sun',
        notes: 'Test ritual completion - feeling energized and connected to solar energies!',
        rating: 5,
        completed_at: new Date('2025-03-06T13:26:06-07:00').toISOString() // Current time from metadata
      })
      .select()
      .single();
    
    if (addError) throw addError;
    if (!addedLog) throw new Error('Failed to add ritual log');
    
    console.log('✅ Successfully logged ritual:', {
      id: addedLog.id,
      ritual_id: addedLog.ritual_id,
      completed_at: addedLog.completed_at,
      rating: addedLog.rating
    });
    
    // Verify we can fetch the ritual logs
    const { data: fetchedLogs, error: fetchError } = await supabase
      .from('ritual_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('completed_at', { ascending: false });
    
    if (fetchError) throw fetchError;
    if (!fetchedLogs || fetchedLogs.length === 0) {
      throw new Error('No ritual logs found');
    }
    
    console.log('✅ Successfully fetched ritual logs:', fetchedLogs.map(log => ({
      id: log.id,
      ritual_id: log.ritual_id,
      completed_at: log.completed_at,
      rating: log.rating
    })));
    
    // Note: We'll keep the test data as it's useful for the app
    
    console.log('\n✨ All ritual logging tests passed!');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('\n❌ Test failed:', error.message);
    } else {
      console.error('\n❌ Test failed:', error);
    }
    process.exit(1);
  }
}

// Run the test
testRitualLogging();
