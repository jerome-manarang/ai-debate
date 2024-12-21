import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://knwumtsjnacnpfltvzrk.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud3VtdHNqbmFjbnBmbHR2enJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NTk2NzgsImV4cCI6MjA1MDEzNTY3OH0.hNtqzjz9NJfn3LXxaq5NM_I-KjxQsbt0Gu4XPIShRhQ'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
