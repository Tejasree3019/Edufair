#!/usr/bin/env node

/**
 * EduFair Project Setup Validation Script
 * Checks if all components are properly configured
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, name) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  log(`${status} ${name}`, exists ? 'green' : 'red');
  return exists;
}

function checkDirectory(dirPath, name) {
  const fullPath = path.join(PROJECT_ROOT, dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  const status = exists ? '✅' : '❌';
  log(`${status} ${name}`, exists ? 'green' : 'red');
  return exists;
}

function checkEnvVariable(key) {
  const envPath = path.join(PROJECT_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    log(`⚠️  .env.local not found`, 'yellow');
    return false;
  }
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const exists = envContent.includes(`${key}=`);
  const status = exists ? '✅' : '❌';
  log(`${status} ${key}`, exists ? 'green' : 'red');
  return exists;
}

// Main checks
function runChecks() {
  console.clear();
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('🚀 EduFair Project Setup Validation', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  console.log('');

  let allChecksPassed = true;

  // Check directories
  log('📁 Directory Structure:', 'blue');
  allChecksPassed &= checkDirectory('src', 'src/');
  allChecksPassed &= checkDirectory('src/app', 'src/app/');
  allChecksPassed &= checkDirectory('src/lib', 'src/lib/');
  allChecksPassed &= checkDirectory('src/types', 'src/types/');
  allChecksPassed &= checkDirectory('supabase', 'supabase/');
  allChecksPassed &= checkDirectory('scripts', 'scripts/');
  allChecksPassed &= checkDirectory('node_modules', 'node_modules/');
  console.log('');

  // Check configuration files
  log('⚙️  Configuration Files:', 'blue');
  allChecksPassed &= checkFile('package.json', 'package.json');
  allChecksPassed &= checkFile('tsconfig.json', 'tsconfig.json');
  allChecksPassed &= checkFile('next.config.js', 'next.config.js');
  allChecksPassed &= checkFile('tailwind.config.ts', 'tailwind.config.ts');
  allChecksPassed &= checkFile('.env.local', '.env.local');
  allChecksPassed &= checkFile('.gitignore', '.gitignore');
  console.log('');

  // Check API routes
  log('🔌 API Routes:', 'blue');
  allChecksPassed &= checkFile('src/app/api/auth/route.ts', 'Authentication');
  allChecksPassed &= checkFile('src/app/api/users/profile/route.ts', 'User Profile');
  allChecksPassed &= checkFile('src/app/api/scholarships/route.ts', 'Scholarships');
  allChecksPassed &= checkFile('src/app/api/recommendations/route.ts', 'Recommendations');
  allChecksPassed &= checkFile('src/app/api/applications/route.ts', 'Applications');
  allChecksPassed &= checkFile('src/app/api/fee-recommendations/route.ts', 'Fee Plans');
  allChecksPassed &= checkFile('src/app/api/institutions/route.ts', 'Institutions');
  allChecksPassed &= checkFile('src/app/api/alerts/route.ts', 'Alerts');
  console.log('');

  // Check frontend pages
  log('📄 Frontend Pages:', 'blue');
  allChecksPassed &= checkFile('src/app/page.tsx', 'Home Page');
  allChecksPassed &= checkFile('src/app/login/page.tsx', 'Login Page');
  allChecksPassed &= checkFile('src/app/register/page.tsx', 'Register Page');
  allChecksPassed &= checkFile('src/app/onboarding/page.tsx', 'Onboarding');
  allChecksPassed &= checkFile('src/app/dashboard/page.tsx', 'Dashboard');
  allChecksPassed &= checkFile('src/app/scholarships/page.tsx', 'Scholarships');
  allChecksPassed &= checkFile('src/app/globals.css', 'Global Styles');
  console.log('');

  // Check core libraries
  log('📚 Core Libraries:', 'blue');
  allChecksPassed &= checkFile('src/lib/supabase.ts', 'Supabase Client');
  allChecksPassed &= checkFile('src/lib/auth.ts', 'Authentication');
  allChecksPassed &= checkFile('src/lib/recommendationEngine.ts', 'Recommendation Engine');
  allChecksPassed &= checkFile('src/lib/feeRecommendationEngine.ts', 'Fee Calculator');
  allChecksPassed &= checkFile('src/lib/utils.ts', 'Utilities');
  allChecksPassed &= checkFile('src/types/index.ts', 'Type Definitions');
  console.log('');

  // Check database files
  log('🗄️  Database Files:', 'blue');
  allChecksPassed &= checkFile('supabase/schema.sql', 'Database Schema');
  allChecksPassed &= checkFile('scripts/seed.js', 'Database Seed Script');
  console.log('');

  // Check documentation
  log('📖 Documentation:', 'blue');
  allChecksPassed &= checkFile('README.md', 'README');
  allChecksPassed &= checkFile('QUICKSTART.md', 'Quick Start');
  allChecksPassed &= checkFile('API_REFERENCE.md', 'API Reference');
  allChecksPassed &= checkFile('PROJECT_SUMMARY.md', 'Project Summary');
  allChecksPassed &= checkFile('DEPLOYMENT_CHECKLIST.md', 'Deployment Guide');
  console.log('');

  // Check environment variables
  log('🔑 Environment Variables:', 'blue');
  checkEnvVariable('NEXT_PUBLIC_SUPABASE_URL');
  checkEnvVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  checkEnvVariable('SUPABASE_SERVICE_ROLE_KEY');
  checkEnvVariable('JWT_SECRET');
  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  if (allChecksPassed) {
    log('✅ All checks passed! Project is ready to develop.', 'green');
    log('', 'green');
    log('Next steps:', 'green');
    log('1. npm run dev          - Start development server', 'green');
    log('2. npm run db:seed      - Seed database with real data', 'green');
    log('3. npm run build        - Build for production', 'green');
  } else {
    log('⚠️  Some checks failed. Please review the items marked with ❌', 'yellow');
    log('', 'yellow');
    log('Common issues:', 'yellow');
    log('1. Missing .env.local file', 'yellow');
    log('2. Not all dependencies installed (run: npm install)', 'yellow');
    log('3. Check SETUP_INSTRUCTIONS.md for configuration details', 'yellow');
  }
  log('═══════════════════════════════════════════════════════════', 'cyan');
}

runChecks();
