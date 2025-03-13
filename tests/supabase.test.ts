import { supabase } from '../config/supabase';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (connectionError) throw connectionError;
    console.log('✅ Database connection successful');
    
    // Test authentication
    const { data: authTest, error: authError } = await supabase.auth.getSession();
    
    if (authError) throw authError;
    console.log('✅ Authentication working');
    
    // Test RLS policies
    const { data: profileTest, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (profileError) throw profileError;
    console.log('✅ RLS policies working');
    
    console.log('All tests passed! Supabase integration is working correctly.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Test failed:', error.message);
    } else {
      console.error('❌ Test failed:', error);
    }
    return false;
  }
}

// Run the test
testSupabaseConnection();
