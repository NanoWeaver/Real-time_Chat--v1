import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojxpknhoadkcobbkrspm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeHBrbmhvYWRrY29iYmtyc3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDMzMzksImV4cCI6MjA1NTk3OTMzOX0.QVnawfOSDQYRCjm58Wreqq9tbAcTdEE_TfcbTZIvoRI';

export const supabase = createClient(supabaseUrl, supabaseKey);