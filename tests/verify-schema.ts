import { supabase } from '../config/supabase';

async function verifySchema() {
  try {
    console.log('Verifying database schema...');

    // Check profiles table
    const { data: profilesCheck, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) throw profilesError;
    console.log('✅ Profiles table exists and is accessible');

    // Check ritual_logs table
    const { data: logsCheck, error: logsError } = await supabase
      .from('ritual_logs')
      .select('*')
      .limit(1);

    if (logsError) throw logsError;
    console.log('✅ Ritual logs table exists and is accessible');

    // Check settings table
    const { data: settingsCheck, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (settingsError) throw settingsError;
    console.log('✅ Settings table exists and is accessible');

    // Verify table schemas
    const { data: profileColumns, error: profileColumnsError } = await supabase
      .rpc('verify_table_columns', { table_name: 'profiles' });
    if (profileColumnsError) throw profileColumnsError;
    console.log('✅ Profiles table schema is correct');

    const { data: logsColumns, error: logsColumnsError } = await supabase
      .rpc('verify_table_columns', { table_name: 'ritual_logs' });
    if (logsColumnsError) throw logsColumnsError;
    console.log('✅ Ritual logs table schema is correct');

    const { data: settingsColumns, error: settingsColumnsError } = await supabase
      .rpc('verify_table_columns', { table_name: 'settings' });
    if (settingsColumnsError) throw settingsColumnsError;
    console.log('✅ Settings table schema is correct');

    console.log('\n✨ Schema verification complete! Database is ready for use.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Schema verification failed:', error.message);
    } else {
      console.error('❌ Schema verification failed:', error);
    }
    return false;
  }
}

verifySchema();
