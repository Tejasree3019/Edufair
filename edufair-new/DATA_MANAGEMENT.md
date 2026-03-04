# 📊 EduFair Data Management & Migration Guide

## Complete Data Inventory

### Current Data (As of Latest Setup)

```
✅ Universities: 18
✅ Scholarships: 23  
✅ Programs: 17
✅ Courses: 20
✅ Demo Users: 2
────────────────────
📊 TOTAL RECORDS: 80
```

### Data Files Location

All real data is stored in JSON format for easy editing:

```
edufair-new/
├── data/
│   ├── universities.json      # 18 universities worldwide
│   ├── scholarships.json      # 23 scholarship opportunities
│   └── programs.json          # 17 programs + 20 courses
├── scripts/
│   ├── database-setup.js      # Main seeding script
│   ├── migrate-data.js        # Data migration tool
│   └── backup-data.js         # Backup/export tool
└── supabase/
    └── schema.sql             # Full database schema
```

---

## Part 1: Data Files (JSON Format)

### universities.json Structure

```json
{
  "universities": [
    {
      "id": "uni_harvard",
      "name": "Harvard University",
      "country": "USA",
      "region": "Massachusetts",
      "city": "Cambridge",
      "type": "private",
      "ranking": 1,
      "tuitionAnnual": 60000,
      "livingCostsAnnual": 20000,
      "currency": "USD",
      "credibilityScore": 0.99,
      "verified": true,
      "fields": ["Business", "Law", "Medicine"],
      "acceptanceRate": 0.03,
      "scholarshipOffered": true,
      "needBased": true,
      "meritBased": true,
      "internationalStudents": true
    }
  ]
}
```

**Key Fields:**
- `id`: Unique identifier (uni_name_format)
- `type`: "private", "public", or "international"
- `tuitionAnnual`: Annual tuition in specified currency
- `credibilityScore`: 0-1 scale (0.99 = very credible)
- `fields`: Array of available study fields
- `acceptanceRate`: Decimal 0-1 (0.03 = 3%)

**How to Add New Universities:**

1. Open `data/universities.json`
2. Add entry to `universities` array:

```json
{
  "id": "uni_youruni",
  "name": "Your University Name",
  "country": "Country",
  ...
}
```

3. Run `node scripts/database-setup.js`

---

### scholarships.json Structure

```json
{
  "scholarships": [
    {
      "id": "sch_harvard_full",
      "name": "Harvard College Scholarship",
      "provider": "Harvard University",
      "description": "Full tuition and living expenses...",
      "amount": 80000,
      "amountType": "full_tuition",
      "currency": "USD",
      "coversLivingExpenses": true,
      "deadline": "2024-12-31",
      "minGPA": 3.8,
      "eligibleCountries": ["USA", "International"],
      "eligibleFields": ["All"],
      "eligibleLevels": ["ug"],
      "credibilityScore": 0.99,
      "acceptanceRate": 0.05,
      "riskLevel": "low",
      "awardCount": 2500,
      "previousAwardees": 2500,
      "needBased": true,
      "meritBased": false
    }
  ]
}
```

**Key Fields:**
- `amountType`: "full_tuition", "partial", or "fixed"
- `deadline`: ISO format date (YYYY-MM-DD)
- `minGPA`: Minimum required GPA (4.0 scale or percentage)
- `eligibleCountries`: Array of countries (use "All" or "International")
- `eligibleFields`: Array of study fields (use "All" for any field)
- `riskLevel`: "low", "medium", or "high" credibility
- `acceptanceRate`: 0.05 = 5% acceptance

**How to Add New Scholarships:**

```bash
# Edit data/scholarships.json
# Add to "scholarships" array:
{
  "id": "sch_youruni_name",
  "name": "Scholarship Name",
  "provider": "Provider Name",
  "amount": 50000,
  "deadline": "2024-12-31",
  ...
}

# Apply changes:
node scripts/database-setup.js
```

---

### programs.json Structure

```json
{
  "programs": [
    {
      "id": "prog_cs_ug",
      "name": "Bachelor of Science in Computer Science",
      "field": "Computer Science",
      "level": "undergraduate",
      "duration": 4,
      "universityId": "uni_stanford",
      "tuitionAnnual": 62000,
      "careerOutcomes": ["Software Engineer", "Data Scientist"],
      "avgSalary": 120000,
      "employmentRate": 0.95
    }
  ],
  "courses": [
    {
      "id": "course_data_structures",
      "name": "Data Structures and Algorithms",
      "field": "Computer Science",
      "level": "undergraduate",
      "credits": 3,
      "description": "...",
      "difficulty": "intermediate"
    }
  ]
}
```

**Program Fields:**
- `level`: "undergraduate" or "postgraduate"
- `duration`: Number of years
- `careerOutcomes`: Array of possible careers
- `employmentRate`: 0.95 = 95% graduates employed

**Course Fields:**
- `credits`: Number of credit hours
- `difficulty`: "introductory", "intermediate", or "advanced"

---

## Part 2: Database Setup & Migration

### Option A: Use Demo Mode (No Migration Needed)

Demo mode loads data automatically on startup:

```bash
cd edufair-new
npm run dev
# Data loads from /data/*.json files automatically
```

✅ Fast  
✅ No database required  
✅ Perfect for development  

---

### Option B: Migrate to Supabase (Production)

#### Step 1: Setup Supabase Account

[Go to supabase.com → Create free project]

Get your credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: https://[project].supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: eyJ...
- `SUPABASE_SERVICE_KEY`: eyJ... (longer, for setup)

#### Step 2: Update Environment

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
NEXT_PUBLIC_DEMO_MODE=false
```

#### Step 3: Run Database Setup

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Run setup (creates tables & loads data)
node scripts/database-setup.js

# Or with reset:
node scripts/database-setup.js --reset
```

This automatically:
- ✅ Creates all 10 tables
- ✅ Loads 18 universities
- ✅ Loads 23 scholarships
- ✅ Loads 17 programs + 20 courses
- ✅ Creates demo accounts

#### Step 4: Verify

```bash
npm run dev
# Test at http://localhost:3001
# Login with: demo@edufair.com / demo123
```

---

## Part 3: Data Operations

### Backup Data

Export all data to JSON:

```bash
node scripts/backup-data.js
# Creates backup_[timestamp].json with all records
```

### Import Data from CSV

To import from CSV files:

```bash
node scripts/import-csv.js data/universities.csv --table institutions
node scripts/import-csv.js data/scholarships.csv --table scholarships
```

### Update Data in Bulk

```bash
# Update all MIT scholarships
node scripts/migrate-data.js --update scholarships \
  --where "provider=MIT" \
  --set "credibilityScore=0.99"
```

### Export for Analytics

```bash
node scripts/export-analytics.js
# Generates:
# - universities_report.csv
# - scholarships_report.csv
# - statistics.json
```

---

## Part 4: Database Best Practices

### 1. Keep JSON Files Updated

When adding new data:

```bash
# Edit JSON file
nano data/universities.json

# Validate JSON syntax
node -e "const f=require('./data/universities.json');console.log('✓ Valid')"

# Apply to database
node scripts/database-setup.js
```

### 2. Regular Backups

```bash
# Backup before major changes
node scripts/backup-data.js

# Restore from backup
node scripts/restore-data.js backup_2024_01_01.json
```

### 3. Testing Changes

```bash
# Test in demo mode first
NEXT_PUBLIC_DEMO_MODE=true npm run dev

# Then migrate to Supabase
NEXT_PUBLIC_DEMO_MODE=false npm run dev
```

### 4. Data Validation

Before running setup, validate your JSON:

```bash
# Validate universities
node scripts/validate-data.js universities

# Validate scholarships
node scripts/validate-data.js scholarships

# Validate all
node scripts/validate-data.js --all
```

### 5. Version Control for Data

Track data changes in git:

```bash
git add data/*.json
git commit -m "Add 5 new universities and 10 scholarships"
git push
```

---

## Part 5: Data Sync Between Environments

### Sync Demo → Supabase

Development with demo data, then push to production:

```bash
# 1. Make data changes locally
nano data/universities.json

# 2. Test in demo mode
NEXT_PUBLIC_DEMO_MODE=true npm run dev

# 3. Switch to Supabase
# (Update .env.local with real Supabase keys)

# 4. Run setup to sync
node scripts/database-setup.js --reset

# 5. Verify in production
npm run dev
```

### Keep Backups in Git

```bash
# Store versioned backups
git add data/backups/
git commit -m "Backup data before major migration"
```

---

## Part 6: Field Reference

### Scholarship Fields Quick Reference

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| id | string | sch_harvard_full | Unique ID |
| name | string | Harvard College Scholarship | Display name |
| amount | number | 80000 | In specified currency |
| amountType | string | full_tuition | full_tuition, partial, fixed |
| deadline | string | 2024-12-31 | ISO format |
| minGPA | number | 3.8 | 4.0 scale or percentage |
| eligibleCountries | array | ["USA", "International"] | Use "All" for any |
| credibilityScore | number | 0.99 | 0-1 scale |
| acceptanceRate | number | 0.05 | 5% = 0.05 |
| riskLevel | string | low | low, medium, high |

### University Fields Quick Reference

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| id | string | uni_harvard | Unique ID |
| name | string | Harvard University | Full name |
| country | string | USA | Country of location |
| type | string | private | private, public, international |
| tuitionAnnual | number | 60000 | Annual cost |
| credibilityScore | number | 0.99 | 0-1 scale |
| acceptanceRate | number | 0.03 | 3% = 0.03 |
| verified | boolean | true | Is verified? |

---

## Part 7: Common Tasks

### Add a New University

```bash
# 1. Edit file
nano data/universities.json

# 2. Add entry (copy existing, modify):
{
  "id": "uni_newuni",
  "name": "New University",
  "country": "Country",
  "type": "private",
  ...
}

# 3. Apply
node scripts/database-setup.js
```

### Add a New Scholarship

```bash
# Similar to universities:
nano data/scholarships.json
# Add entry
node scripts/database-setup.js
```

### Update Tuition Amounts

```bash
# Edit universities.json
# Change tuitionAnnual for affected entries
node scripts/database-setup.js
```

### Filter by Country

```bash
# Query example (in code):
const usUniversities = universities.filter(u => u.country === 'USA')
const intlScholarships = scholarships.filter(s => 
  s.eligibleCountries.includes('International')
)
```

---

## Part 8: Performance Tips

### Indexing

Key fields are indexed for fast queries:
- `email` (users)
- `country` (universities)
- `provider` (scholarships)
- `deadline` (scholarships)

### Query Limits

- Max 100 records per query
- Use pagination for large datasets
- Filter before fetching

### Cache Strategies

```typescript
// Cache in-memory (demo mode)
const cachedData = JSON.parse(localStorage.getItem('universities') || '[]')

// Cache with TTL (production)
const cacheExpiry = Date.now() + 3600000 // 1 hour
```

---

## Quick Reference: Common Commands

```bash
# Setup database
node scripts/database-setup.js

# Reset database
node scripts/database-setup.js --reset

# Backup data
node scripts/backup-data.js

# Validate JSON
node scripts/validate-data.js --all

# Export to CSV
node scripts/export-analytics.js

# Run app in demo mode
NEXT_PUBLIC_DEMO_MODE=true npm run dev

# Run app with Supabase
NEXT_PUBLIC_DEMO_MODE=false npm run dev
```

---

## Support

**Need help?**

- Check `.env.local` configuration
- Verify JSON file syntax: `node -e "require('./data/universities.json')"`
- Review logs: `node scripts/database-setup.js 2>&1 | tee setup.log`
- Check Supabase dashboard for table creation
- Ensure Supabase credentials are correct

**Questions about fields?**

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed documentation.

---

**You're ready to manage your data! 🗄️**

- Demo mode: ✅ Ready
- Supabase: ✅ Ready to configure  
- Data files: ✅ Well organized
- Scripts: ✅ Automated

Start building your scholarship database! 💪
