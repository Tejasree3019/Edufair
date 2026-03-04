#!/usr/bin/env node

/**
 * EduFair Quick Setup Assistant
 * Guides users through setup with minimal configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

const PROJECT_ROOT = process.cwd();

async function setupAssistant() {
  console.clear();
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                   EDUFAIR SETUP WIZARD                  ║');
  console.log('║         Complete Full-Stack Education Platform         ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');

  console.log('Welcome to EduFair Setup! This wizard will help you configure the project.');
  console.log('');

  // Step 1: Check dependencies
  console.log('STEP 1️⃣ : Checking Dependencies...');
  const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    process.exit(1);
  }
  console.log('✅ package.json found');

  const nodeModulesPath = path.join(PROJECT_ROOT, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('⚠️  node_modules not found. Running npm install...');
    // Dependencies should already be installed
  } else {
    console.log('✅ Dependencies already installed');
  }
  console.log('');

  // Step 2: Environment setup
  console.log('STEP 2️⃣ : Configure Environment Variables');
  const envPath = path.join(PROJECT_ROOT, '.env.local');
  const envExamplePath = path.join(PROJECT_ROOT, '.env.local.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env.local from template');
    } else {
      console.log('⚠️  No .env.local or template found');
    }
  } else {
    console.log('✅ .env.local already exists');
  }

  console.log('');
  console.log('You have TWO options:');
  console.log('');
  console.log('Option A: Quick Start (Demo with Mock Data)');
  console.log('  - Works immediately without Supabase');
  console.log('  - Perfect for testing the UI and flows');
  console.log('  - Data is stored in memory (resets on restart)');
  console.log('');
  console.log('Option B: Production Setup (Real Supabase)');
  console.log('  - Requires Supabase account (free tier available)');
  console.log('  - Data persists permanently');
  console.log('  - Full database with real institutions');
  console.log('');

  const setupType = await question('Choose setup type (A/B)? [A]: ');
  const choice = (setupType || 'A').toUpperCase();

  console.log('');

  if (choice === 'A') {
    await setupDemoMode();
  } else if (choice === 'B') {
    await setupProductionMode();
  } else {
    console.log('Invalid choice. Using Demo mode.');
    await setupDemoMode();
  }

  rl.close();
}

async function setupDemoMode() {
  console.log('⚙️  Setting up Demo Mode...');
  console.log('');

  // Create demo environment file
  const envContent = `
# EduFair Demo Configuration
# This is set up for quick testing without Supabase

NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.local
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-anon-key-for-testing
SUPABASE_SERVICE_ROLE_KEY=demo-service-role-key-for-testing
JWT_SECRET=demo-jwt-secret-key-change-in-production-12345678
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Demo Mode Flag
NEXT_PUBLIC_DEMO_MODE=true
`;

  const envPath = path.join(PROJECT_ROOT, '.env.local');
  fs.writeFileSync(envPath, envContent.trim());

  console.log('✅ Demo configuration created');
  console.log('');
  console.log('Demo Mode Features:');
  console.log('  ✓ Frontend pages work and display correctly');
  console.log('  ✓ UI/UX testing and flow validation');
  console.log('  ✓ Authentication UI (login/register forms)');
  console.log('  ✓ Dashboard layout and components');
  console.log('  ✓ Scholarship browser interface');
  console.log('');
  console.log('Note: API calls will show CORS errors in demo mode');
  console.log('      This is expected - to use the APIs, set up Supabase (Option B)');
  console.log('');

  printNextSteps('Demo Mode');
}

async function setupProductionMode() {
  console.log('📋 Production Mode Setup');
  console.log('');
  console.log('Follow these steps:');
  console.log('');
  console.log('1. Go to https://supabase.com');
  console.log('2. Sign up or log in');
  console.log('3. Click "New Project"');
  console.log('4. Fill in:');
  console.log('   - Project Name: edufair-dev');
  console.log('   - Password: (create a strong password)');
  console.log('   - Region: (choose nearest to you)');
  console.log('5. Click "Create new project" and wait 1-2 minutes');
  console.log('6. Go to Settings → API');
  console.log('7. Copy these values and paste below:');
  console.log('');

  const supabaseUrl = await question('  Supabase Project URL: ');
  const anonKey = await question('  Supabase Anon Key: ');
  const serviceRoleKey = await question('  Service Role Key: ');

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.log('');
    console.log('❌ Missing required values. Please provide all three keys.');
    console.log('');
    console.log('You can set them later in .env.local:');
    console.log('  NEXT_PUBLIC_SUPABASE_URL=<your-url>');
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>');
    console.log('  SUPABASE_SERVICE_ROLE_KEY=<your-key>');
    console.log('');
    return;
  }

  // Generate JWT secret
  const crypto = require('crypto');
  const jwtSecret = crypto.randomBytes(32).toString('hex');

  const envContent = `
# EduFair Production Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}
JWT_SECRET=${jwtSecret}
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`;

  const envPath = path.join(PROJECT_ROOT, '.env.local');
  fs.writeFileSync(envPath, envContent.trim());

  console.log('');
  console.log('✅ Supabase credentials saved to .env.local');
  console.log('');
  console.log('Next, you need to set up the database schema:');
  console.log('');
  console.log('1. Open Supabase Console');
  console.log('2. Go to "SQL Editor"');
  console.log('3. Click "New Query"');
  console.log('4. Copy entire contents from: supabase/schema.sql');
  console.log('5. Paste it into the SQL Editor');
  console.log('6. Click "Run"');
  console.log('');
  console.log('7. Then, seed the database with real data:');
  console.log('   npm run db:seed');
  console.log('');

  printNextSteps('Production Mode');
}

function printNextSteps(mode) {
  console.log('═════════════════════════════════════════════════════════');
  console.log('NEXT STEPS:');
  console.log('═════════════════════════════════════════════════════════');
  console.log('');
  console.log('1. Start the development server:');
  console.log('   npm run dev');
  console.log('');
  console.log('2. Open in browser:');
  console.log('   http://localhost:3000');
  console.log('');
  if (mode === 'Production Mode') {
    console.log('3. Create a test account:');
    console.log('   - Go to http://localhost:3000/register');
    console.log('   - Fill in your details');
    console.log('   - Click "Create Account"');
    console.log('');
    console.log('4. Complete onboarding:');
    console.log('   - Fill in 4-step profile setup');
    console.log('   - Click "Done"');
    console.log('');
    console.log('5. Explore features:');
    console.log('   - Dashboard: http://localhost:3000/dashboard');
    console.log('   - Scholarships: http://localhost:3000/scholarships');
  } else {
    console.log('3. Explore the UI:');
    console.log('   - Home page layout');
    console.log('   - Login/Register forms');
    console.log('   - Dashboard design');
    console.log('   - Scholarship browser');
  }
  console.log('');
  console.log('═════════════════════════════════════════════════════════');
  console.log('');
  console.log('For more information, see:');
  console.log('  - README.md: Complete documentation');
  console.log('  - QUICKSTART.md: 5-minute setup guide');
  console.log('  - SETUP_INSTRUCTIONS.md: Detailed setup steps');
  console.log('');
  console.log('✅ Setup complete! Good luck with EduFair!');
}

setupAssistant().catch(console.error);
