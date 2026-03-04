#!/usr/bin/env node

/**
 * Database Setup Script for EduFair
 * Initializes and seeds the Supabase database with real data
 * 
 * Usage:
 *   node scripts/database-setup.js           // Use default .env.local
 *   node scripts/database-setup.js --demo    // Use demo mode only
 *   node scripts/database-setup.js --reset   // Clear and reset database
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Load real data from JSON files
const universitiesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'universities.json'), 'utf-8'));
const scholarshipsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'scholarships.json'), 'utf-8'));
const programsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'programs.json'), 'utf-8'));

const chalk = {
  green: (str) => `\x1b[32m${str}\x1b[0m`,
  yellow: (str) => `\x1b[33m${str}\x1b[0m`,
  red: (str) => `\x1b[31m${str}\x1b[0m`,
  blue: (str) => `\x1b[36m${str}\x1b[0m`,
  bold: (str) => `\x1b[1m${str}\x1b[0m`,
};

async function main() {
  const args = process.argv.slice(2);
  const isDemo = args.includes('--demo');
  const isReset = args.includes('--reset');

  console.log(chalk.blue(`
╔════════════════════════════════════════════════════════════╗
║          EduFair Database Setup & Seeding                  ║
║          Version 1.0                                       ║
╚════════════════════════════════════════════════════════════╝
  `));

  // Check environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const demoMode = isDemo || !supabaseUrl || supabaseUrl.includes('demo');

  console.log(chalk.bold('📋 Configuration:'));
  console.log(`   Database Mode: ${demoMode ? chalk.yellow('DEMO MODE (In-Memory)') : chalk.green('PRODUCTION (Supabase)')}`);
  console.log(`   Universities: ${universitiesData.universities.length}`);
  console.log(`   Scholarships: ${scholarshipsData.scholarships.length}`);
  console.log(`   Programs: ${programsData.programs.length}`);
  console.log(`   Courses: ${programsData.courses.length}`);
  console.log('');

  if (demoMode) {
    await setupDemoMode();
  } else {
    await setupSupabaseMode();
  }
}

async function setupDemoMode() {
  console.log(chalk.bold('🎮 Setting up Demo Mode...'));
  console.log('');

  // Create an enhanced demo data file
  const demoDataContent = {
    universities: universitiesData.universities,
    scholarships: scholarshipsData.scholarships,
    programs: programsData.programs,
    courses: programsData.courses,
    users: [
      {
        id: '1',
        email: 'demo@edufair.com',
        fullName: 'Demo Student',
        role: 'student',
        country: 'India',
        educationLevel: 'ug',
        preferredField: 'Computer Science',
        academicGrade: 3.8,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'admin@edufair.com',
        fullName: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ],
    metadata: {
      setupDate: new Date().toISOString(),
      dataVersion: '1.0',
      totalUniversities: universitiesData.universities.length,
      totalScholarships: scholarshipsData.scholarships.length,
      totalPrograms: programsData.programs.length,
      totalCourses: programsData.courses.length,
    },
  };

  // Save to a reference file
  const demoDataPath = path.join(__dirname, '..', '.demo-data.json');
  fs.writeFileSync(demoDataPath, JSON.stringify(demoDataContent, null, 2));

  console.log(chalk.green('✓') + ' Demo data initialized');
  console.log(chalk.green('✓') + ` ${universitiesData.universities.length} universities loaded`);
  console.log(chalk.green('✓') + ` ${scholarshipsData.scholarships.length} scholarships loaded`);
  console.log(chalk.green('✓') + ` ${programsData.programs.length} programs loaded`);
  console.log(chalk.green('✓') + ` ${programsData.courses.length} courses loaded`);
  console.log(chalk.green('✓') + ' Demo accounts created');
  console.log('');
  console.log(chalk.bold('📝 Demo Credentials:'));
  console.log('   Student: demo@edufair.com / demo123');
  console.log('   Admin: admin@edufair.com / admin123');
  console.log('');
  console.log(chalk.green('✅ Demo mode ready! No database connection required.'));
}

async function setupSupabaseMode() {
  console.log(chalk.bold('☁️  Setting up Supabase Mode...'));
  console.log('');

  try {
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not found in .env.local');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Reset if requested
    if (process.argv.includes('--reset')) {
      console.log(chalk.yellow('⚠️  Resetting database...'));
      await resetDatabase(supabase);
      console.log(chalk.green('✓ Database reset'));
    }

    // Seed universities
    console.log(chalk.bold('🏫 Seeding Universities...'));
    const universitiesResult = await supabase.from('institutions').insert(
      universitiesData.universities.map((uni) => ({
        name: uni.name,
        country: uni.country,
        region_state: uni.region,
        location_city: uni.city,
        institution_type: uni.type,
        average_tuition_annual: uni.tuitionAnnual,
        average_living_costs_annual: uni.livingCostsAnnual,
        currency: uni.currency,
        credibility_score: uni.credibilityScore,
        verified: uni.verified,
      }))
    );

    if (universitiesResult.error) {
      console.log(chalk.red('✗ Error seeding universities'));
      console.log(chalk.red(universitiesResult.error.message));
    } else {
      console.log(chalk.green(`✓ ${universitiesData.universities.length} universities added`));
    }

    // Seed scholarships
    console.log(chalk.bold('🎓 Seeding Scholarships...'));
    const scholarshipsResult = await supabase.from('scholarships').insert(
      scholarshipsData.scholarships.map((sch) => ({
        name: sch.name,
        provider_name: sch.provider,
        description: sch.description,
        scholarship_amount: sch.amount,
        amount_type: sch.amountType,
        currency: sch.currency,
        covers_living_expenses: sch.coversLivingExpenses,
        application_deadline: sch.deadline,
        min_academic_grade: sch.minGPA,
        credibility_score: sch.credibilityScore,
        historical_acceptance_rate: sch.acceptanceRate,
        risk_level: sch.riskLevel,
        total_awards_available: sch.awardCount,
        previous_year_awardees: sch.previousAwardees,
        status: 'active',
      }))
    );

    if (scholarshipsResult.error) {
      console.log(chalk.red('✗ Error seeding scholarships'));
      console.log(chalk.red(scholarshipsResult.error.message));
    } else {
      console.log(chalk.green(`✓ ${scholarshipsData.scholarships.length} scholarships added`));
    }

    // Seed programs
    console.log(chalk.bold('📚 Seeding Programs...'));
    const programsResult = await supabase.from('programs').insert(
      programsData.programs.map((prog) => ({
        name: prog.name,
        field: prog.field,
        level: prog.level,
        duration: prog.duration,
        tuition_annual: prog.tuitionAnnual,
        avg_salary: prog.avgSalary,
        employment_rate: prog.employmentRate,
      }))
    );

    if (programsResult.error) {
      console.log(chalk.red('✗ Error seeding programs'));
      console.log(chalk.red(programsResult.error.message));
    } else {
      console.log(chalk.green(`✓ ${programsData.programs.length} programs added`));
    }

    console.log('');
    console.log(chalk.green('✅ Supabase seeding complete!'));
  } catch (error) {
    console.log(chalk.red('❌ Setup failed:'));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

async function resetDatabase(supabase) {
  try {
    // Delete in order to respect foreign keys
    await supabase.from('programs').delete().neq('id', '');
    await supabase.from('scholarships').delete().neq('id', '');
    await supabase.from('institutions').delete().neq('id', '');
    await supabase.from('courses').delete().neq('id', '');
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not reset some tables (may already be empty)'));
  }
}

// Run setup
main().catch((error) => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
