// Extract Supabase project info from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Extract project ID from URL (e.g., https://lajgxkcqnqmgzofshqdg.supabase.co -> lajgxkcqnqmgzofshqdg)
export const projectId = supabaseUrl?.split('//')[1]?.split('.')[0] || '';

export const publicAnonKey = supabaseAnonKey || '';
