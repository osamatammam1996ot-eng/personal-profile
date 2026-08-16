const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase keys in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setup() {
  console.log('Connecting to Supabase...');
  
  // Create bucket
  const { data: bucket, error: bucketError } = await supabase
    .storage
    .createBucket('cms-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });
    
  if (bucketError) {
    if (bucketError.message.includes('already exists') || bucketError.message.includes('Duplicate')) {
      console.log('Bucket "cms-images" already exists.');
      // ensure it's public
      await supabase.storage.updateBucket('cms-images', { public: true });
      console.log('Ensured bucket is public.');
    } else {
      console.error('Error creating bucket:', bucketError);
      process.exit(1);
    }
  } else {
    console.log('Bucket "cms-images" created successfully and set to public.');
  }
}

setup();
