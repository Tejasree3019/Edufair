#!/usr/bin/env node

// Quick API Test Script

const BASE_URL = 'http://localhost:3001/api';

async function testRegistration() {
  console.log('\n=== Testing Registration ===');
  try {
    const res = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        email: 'demo@edufair.com',
        password: 'demo123',
        fullName: 'Demo Student',
        role: 'student'
      })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data.token;
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function testLogin() {
  console.log('\n=== Testing Login ===');
  try {
    const res = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: 'demo@edufair.com',
        password: 'demo123'
      })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data.token;
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function testScholarships(token) {
  console.log('\n=== Testing Scholarships ===');
  try {
    const res = await fetch(`${BASE_URL}/scholarships?country=India&field=STEM`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Found ${data.total} scholarships:`, 
      data.scholarships?.slice(0, 2).map(s => `\n  - ${s.name} ($${s.scholarship_amount})`).join(''));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function testRecommendations(token) {
  console.log('\n=== Testing Recommendations ===');
  try {
    const res = await fetch(`${BASE_URL}/recommendations?country=India&field=STEM&educationLevel=ug&gpa=3.8`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Recommendations:`,
      data.recommendations?.slice(0, 2).map(r => `\n  - ${r.scholarship_name} (Score: ${(r.overall_suitability_score * 100).toFixed(1)}%)`).join(''));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function runTests() {
  console.log('🧪 Testing EduFair API...\n');
  
  // Test registration
  let token = await testRegistration();
  
  // Test login
  token = await testLogin();
  
  // Test scholarships
  if (token) {
    await testScholarships(token);
    
    // Test recommendations
    await testRecommendations(token);
  }
  
  console.log('\n✅ API Testing Complete!');
}

runTests().catch(console.error);
