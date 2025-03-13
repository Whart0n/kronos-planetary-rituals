import { supabase } from '../config/supabase';

async function createTestUser() {
  try {
    const testEmail = 'test@gmail.com';
    console.log('Creating test user with email:', testEmail);
    
    // Sign up new user
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestRitual123!',
      options: {
        data: {
          name: 'Test Seeker'
        }
      }
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');
    
    const userId = data.user.id;
    console.log('✅ User created with ID:', userId);
    
    // Wait for trigger to create profile and settings
    console.log('Waiting for trigger functions...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify profile was created
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    console.log('✅ Profile created:', {
      id: profile.id,
      name: profile.name,
      level: profile.level,
      experience: profile.experience,
      streak_days: profile.streak_days
    });
    
    // Verify settings were created
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (settingsError) throw settingsError;
    console.log('✅ Settings created:', {
      dark_mode: settings.dark_mode,
      notifications: settings.notifications,
      language: settings.language,
      theme: settings.theme
    });
    
    console.log('\n📝 Test User Credentials:');
    console.log('Email:', testEmail);
    console.log('Password: TestRitual123!');
    
    return { email: testEmail, password: 'TestRitual123!', userId };
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Failed to create test user:', error.message);
    } else {
      console.error('❌ Failed to create test user:', error);
    }
    throw error;
  }
}

createTestUser()
  .then(credentials => {
    console.log('\n✨ Test user creation complete!');
  })
  .catch(error => {
    console.error('\n❌ Test failed!');
    process.exit(1);
  });

