import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function syncUser() {
  // 1. Get the current logged-in user from Clerk
  const user = await currentUser();
  
  if (!user) return; // Not logged in

  // 2. Connect to Supabase with ADMIN privileges (to ensure we can write)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  // 3. Check if user exists in Supabase
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  // 4. If they don't exist, CREATE THEM INSTANTLY
  if (!existingProfile) {
    const email = user.emailAddresses[0]?.emailAddress;
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    await supabaseAdmin.from('profiles').insert({
      id: user.id,
      email: email,
      full_name: name,
      role: 'student', // Default role
    });
    
    console.log(`[Sync] User ${user.id} synced to database.`);
  }
}