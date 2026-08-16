const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.local' });

const envs = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY }
];

for (const env of envs) {
  if (env.value) {
    for (const environment of ['production']) {
      console.log(`Adding ${env.name} to ${environment}...`);
      try {
        execSync(`npx vercel env add ${env.name} ${environment} --value "${env.value}" --yes`, {
          stdio: ['pipe', 'inherit', 'inherit']
        });
      } catch (e) {
        console.error(`Failed to add ${env.name} to ${environment}: ${e.message}`);
      }
    }
  }
}
