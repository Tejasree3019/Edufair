/**
 * Test Suite for Scholarship Data Fetcher
 * Tests real-time data fetching, caching, and filtering
 */

import ScholarshipDataFetcher from '@/lib/scholarshipFetcher'

describe('ScholarshipDataFetcher', () => {
  let fetcher: ScholarshipDataFetcher

  beforeEach(() => {
    fetcher = new ScholarshipDataFetcher()
    fetcher.clearCache()
  })

  describe('Fetching and Caching', () => {
    test('should fetch scholarships from all sources', async () => {
      const scholarships = await fetcher.fetchAllScholarships()

      expect(Array.isArray(scholarships)).toBe(true)
      expect(scholarships.length).toBeGreaterThan(0)
    })

    test('should cache scholarship data', async () => {
      const firstFetch = await fetcher.fetchAllScholarships()
      const stats1 = fetcher.getCacheStats()

      const secondFetch = await fetcher.fetchAllScholarships()
      const stats2 = fetcher.getCacheStats()

      expect(firstFetch).toEqual(secondFetch)
      expect(stats1.cacheEntries).toBeGreaterThan(0)
    })

    test('should clear cache when requested', async () => {
      await fetcher.fetchAllScholarships()
      let stats = fetcher.getCacheStats()
      expect(stats.cacheEntries).toBeGreaterThan(0)

      fetcher.clearCache()
      stats = fetcher.getCacheStats()
      expect(stats.cacheEntries).toBe(0)
    })
  })

  describe('Filtering', () => {
    test('should filter scholarships by amount', async () => {
      const scholarships = await fetcher.fetchAllScholarships()

      const filtered = fetcher.filterScholarships(scholarships, {
        minAmount: 10000,
        maxAmount: 50000,
      })

      filtered.forEach((scholarship) => {
        expect(scholarship.amount).toBeGreaterThanOrEqual(10000)
        expect(scholarship.amount).toBeLessThanOrEqual(50000)
      })
    })

    test('should filter scholarships by source', async () => {
      const scholarships = await fetcher.fetchAllScholarships()

      const filtered = fetcher.filterScholarships(scholarships, {
        source: 'Government',
      })

      filtered.forEach((scholarship) => {
        expect(scholarship.source).toBe('Government')
      })
    })

    test('should filter scholarships by credibility', async () => {
      const scholarships = await fetcher.fetchAllScholarships()

      const filtered = fetcher.filterScholarships(scholarships, {
        minCredibility: 0.9,
      })

      filtered.forEach((scholarship) => {
        expect(scholarship.credibility_score).toBeGreaterThanOrEqual(0.9)
      })
    })
  })

  describe('Ranking', () => {
    test('should rank scholarships by user profile match', async () => {
      const scholarships = await fetcher.fetchAllScholarships()

      const userProfile = {
        gpa: 3.8,
        testScore: 98,
        field: 'Engineering',
        state: 'Maharashtra',
      }

      const ranked = fetcher.rankScholarships(scholarships, userProfile)

      expect(ranked[0].matchPercentage).toBeGreaterThanOrEqual(ranked[1].matchPercentage)
      ranked.forEach((scholarship) => {
        expect(scholarship.matchPercentage).toBeLessThanOrEqual(100)
        expect(scholarship.matchPercentage).toBeGreaterThanOrEqual(0)
      })
    })

    test('should include match details in ranking', async () => {
      const scholarships = await fetcher.fetchAllScholarships()

      const userProfile = {
        gpa: 3.5,
        testScore: 95,
        field: 'Science',
      }

      const ranked = fetcher.rankScholarships(scholarships, userProfile)

      ranked.forEach((scholarship) => {
        expect(scholarship).toHaveProperty('matchDetails')
        expect(scholarship.matchDetails).toHaveProperty('gpaMatch')
        expect(scholarship.matchDetails).toHaveProperty('fieldMatch')
      })
    })
  })
})
