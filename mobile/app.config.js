import 'dotenv/config';

export default {
  expo: {
    name: "CalorieCulator",
    slug: "calorieculator",
    extra: {
        // Backend Upload Route
        VITE_API_URL: "http://127.0.0.1:8000/upload/",
        // Supabase Credentials
        VITE_SUPABASE_URL: "https://ayumvsnqqgmxurysmkke.supabase.co",
        VITE_SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dW12c25xcWdteHVyeXNta2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxOTY4NjQsImV4cCI6MjA1NTc3Mjg2NH0.j7ReaL88SfFZWnih7EG8uCsjS9AImtZnGUgymmp_TBU"
    },
  },
};