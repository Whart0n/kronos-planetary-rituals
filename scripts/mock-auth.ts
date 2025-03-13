import { supabase } from '../app/config/supabase';

/**
 * Script to sign in with a test user account
 * This will help bypass authentication errors when testing the app
 */
async function signInWithTestAccount() {
  console.log('Attempting to sign in with test account...');
  
  try {
    // Get the test user credentials from environment variables
    const email = 'test@example.com';
    const password = process.env.USER_PASSWORD || 'biggulp';
    
    // Sign in with the test account
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error.message);
      
      // If the user doesn't exist, create a new account
      if (error.message.includes('Invalid login credentials')) {
        console.log('Test account does not exist. Creating a new account...');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          console.error('Error creating test account:', signUpError.message);
        } else {
          console.log('Test account created successfully!');
          console.log('User ID:', signUpData.user?.id);
        }
      }
    } else {
      console.log('Signed in successfully!');
      console.log('User ID:', data.user?.id);
      console.log('Session expires at:', data.session?.expires_at);
    }
  } catch (error) {
    console.error('Unexpected error during authentication:', error);
  }
}

// Run the sign-in function
signInWithTestAccount();
