// supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY; // Use the anon key for operations

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("SUPABASE_URL", process.env.SUPABASE_URL)
console.log("SUPABASE_KEY", process.env.SUPABASE_ANON_KEY?.slice(0, 10))



module.exports = supabaseAdmin;
