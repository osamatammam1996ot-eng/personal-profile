import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixWhyHireMe() {
  console.log('Fetching CMS data...');
  const { data, error } = await supabase
    .from('cms_data')
    .select('data')
    .eq('id', 'main')
    .single();

  if (error || !data) {
    console.error('Error fetching:', error);
    return;
  }

  const cms = data.data;

  // Fix ALL CAPS in Why Hire Me
  if (cms.whyHireMe && cms.whyHireMe.word1) {
    cms.whyHireMe.word1.en = 'Why';
    cms.whyHireMe.word2.en = 'Hire';
    cms.whyHireMe.word3.en = 'Me';
  }

  console.log('Uploading fixed data back to Supabase...');
  const { error: upsertError } = await supabase
    .from('cms_data')
    .upsert({ id: 'main', data: cms, updated_at: new Date().toISOString() }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Failed to update:', upsertError);
  } else {
    console.log('Successfully fixed Why Hire Me text!');
  }
}

fixWhyHireMe();
