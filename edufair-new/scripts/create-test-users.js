#!/usr/bin/env node

/**
 * Setup script to create test users in Supabase
 * Run with: node scripts/create-test-users.js
 */

import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const testUsers = [
  {
    email: 'student@example.com',
    password: 'password123',
    full_name: 'Test Student',
    role: 'student',
  },
  {
    email: 'demo@edufair.com',
    password: 'demo123',
    full_name: 'Demo Student',
    role: 'student',
  },
  {
    email: 'admin@edufair.com',
    password: 'admin123',
    full_name: 'Admin User',
    role: 'admin',
  },
]

async function createTestUsers() {
  console.log('🚀 Creating test users in Supabase...\n')

  for (const testUser of testUsers) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', testUser.email)
        .single()

      if (existingUser) {
        console.log(`⏭️  ${testUser.email} already exists, skipping...`)
        continue
      }

      // Hash password
      const password_hash = await bcrypt.hash(testUser.password, 10)

      // Create user
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: testUser.email,
          password_hash,
          full_name: testUser.full_name,
          role: testUser.role,
        })
        .select()
        .single()

      if (error) {
        console.error(`❌ Error creating ${testUser.email}:`, error.message)
      } else {
        console.log(`✅ Created user: ${testUser.email}`)
        console.log(`   ID: ${data.id}`)
        console.log(`   Password: ${testUser.password}\n`)
      }
    } catch (error) {
      console.error(`❌ Error creating ${testUser.email}:`, error)
    }
  }

  console.log('✨ Test user setup complete!')
  console.log('\n📝 To test, log in with:')
  for (const user of testUsers) {
    console.log(`   Email: ${user.email} | Password: ${user.password}`)
  }
}

createTestUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
