import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  document.body.innerHTML =
    '<pre style="padding:16px;font-family:monospace;white-space:pre-wrap;">' +
    'Missing Supabase config.\n\n' +
    'VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY were not set when this app was built. ' +
    'Check the GitHub Actions repo secrets and rebuild.' +
    '</pre>'
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, key)
