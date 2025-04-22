import 'dotenv/config';

export default {
  expo: {
    name: "CalorieCulator",
    slug: "calorieculator",
    extra: {
        // Backend Upload Route
        API_URL: "http://192.168.1.19:8000/upload/",
        // Supabase Credentials
        SUPABASE_URL: "https://ayumvsnqqgmxurysmkke.supabase.co",
        SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dW12c25xcWdteHVyeXNta2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxOTY4NjQsImV4cCI6MjA1NTc3Mjg2NH0.j7ReaL88SfFZWnih7EG8uCsjS9AImtZnGUgymmp_TBU"
    },
  },
};