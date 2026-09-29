import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PROJECT_NAME: process.env.PROJECT_NAME || 'Smart Curriculum & Attendance App',
  TEAM_NAME: process.env.TEAM_NAME || 'Institutional Engineering',
  HACKATHON_NAME: process.env.HACKATHON_NAME || 'Edition 2026',
  DEMO_URL: process.env.DEMO_URL || '[YOUR DEMO URL]',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey_smart_attendance_2026',
  PYTHON_API_URL: process.env.PYTHON_API_URL || 'http://localhost:8000',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};
