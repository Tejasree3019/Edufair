/**
 * Real-Time Scholarship Data Fetcher
 * Fetches scholarship data from multiple sources and caches results
 * Supports: Government portals, university sites, third-party APIs
 */

interface ScholarshipSource {
  name: string
  type: 'government' | 'university' | 'private' | 'ngo'
  url?: string
  dataFormat: 'json' | 'html' | 'csv'
  updateInterval: number // in minutes
  lastFetch?: Date
  status: 'active' | 'inactive' | 'error'
}

interface CachedData {
  data: any[]
  timestamp: Date
  source: string
  expiresAt: Date
}

class ScholarshipDataFetcher {
  private cache: Map<string, CachedData> = new Map()
  private sources: Map<string, ScholarshipSource> = new Map()
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 5000 // 5 seconds

  constructor() {
    this.initializeSources()
  }

  /**
   * Initialize scholarship data sources
   */
  private initializeSources(): void {
    // Government portals
    this.sources.set('nss', {
      name: 'National Scholarship Scheme',
      type: 'government',
      url: 'https://scholarships.gov.in',
      dataFormat: 'json',
      updateInterval: 60,
      status: 'active',
    })

    this.sources.set('nsp', {
      name: 'National Scholarship Portal',
      type: 'government',
      url: 'https://nsp.gov.in',
      dataFormat: 'json',
      updateInterval: 60,
      status: 'active',
    })

    // IIT Scholarships
    this.sources.set('iit-scholarships', {
      name: 'IIT Scholarship Portal',
      type: 'university',
      dataFormat: 'json',
      updateInterval: 120,
      status: 'active',
    })

    // NIT Scholarships
    this.sources.set('nit-scholarships', {
      name: 'NIT Scholarship Portal',
      type: 'university',
      dataFormat: 'json',
      updateInterval: 120,
      status: 'active',
    })

    // State-level scholarships
    this.sources.set('state-scholarships', {
      name: 'State Scholarship Portals',
      type: 'government',
      dataFormat: 'json',
      updateInterval: 180,
      status: 'active',
    })

    // Private organizations
    this.sources.set('csf-scholarships', {
      name: 'CSF Scholarships',
      type: 'private',
      dataFormat: 'json',
      updateInterval: 240,
      status: 'active',
    })
  }

  /**
   * Fetch scholarships from all sources with caching
   */
  async fetchAllScholarships(): Promise<any[]> {
    const cacheKey = 'all_scholarships'
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      console.log('[Cache] Returning cached scholarship data')
      return cached.data
    }

    console.log('[Fetch] Fetching from all scholarship sources...')
    const allScholarships: any[] = []
    const errors: Array<{ source: string; error: string }> = []

    // Fetch from all active sources in parallel
    const fetchPromises = Array.from(this.sources.entries())
      .filter(([_, source]) => source.status === 'active')
      .map(([sourceId, source]) => this.fetchFromSource(sourceId, source))

    const results = await Promise.allSettled(fetchPromises)

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        allScholarships.push(...result.value)
      } else if (result.status === 'rejected') {
        const sourceId = Array.from(this.sources.keys())[index] || 'unknown'
        errors.push({
          source: sourceId,
          error: result.reason?.message || 'Unknown error',
        })
      }
    })

    // Log any errors but continue with available data
    if (errors.length > 0) {
      console.warn('[Fetch] Errors fetching from some sources:', errors)
    }

    // Cache the results
    this.setCache(cacheKey, allScholarships, 'combined')

    console.log(`[Fetch] Fetched ${allScholarships.length} scholarships from ${this.sources.size} sources`)
    return allScholarships
  }

  /**
   * Fetch scholarships from a specific source
   */
  private async fetchFromSource(sourceId: string, source: ScholarshipSource): Promise<any[]> {
    const cacheKey = `source_${sourceId}`
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      console.log(`[Cache] Using cached data for ${source.name}`)
      return cached.data
    }

    console.log(`[Fetch] Fetching from ${source.name}...`)

    // Mock data fetcher - in production, this would use actual APIs
    const scholarships = await this.fetchMockData(sourceId, source)

    // Cache the results
    this.setCache(cacheKey, scholarships, sourceId)
    source.lastFetch = new Date()

    return scholarships
  }

  /**
   * Fetch mock data (replace with actual API calls in production)
   */
  private async fetchMockData(sourceId: string, source: ScholarshipSource): Promise<any[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000))

    // Mock scholarships from different sources
    const mockSources: Record<string, any[]> = {
      'nss': [
        {
          id: 'nss_001',
          name: 'National Scholarship Scheme (NSS)',
          amount: 10000,
          source: 'Government',
          coverage: 'Tuition + Living',
          eligibility: '12th pass, Family income < 8 LPA',
          deadline: '2026-06-30',
          credibility_score: 0.99,
          awards_available: 50000,
          url: 'https://scholarships.gov.in/nss',
        },
      ],
      'nsp': [
        {
          id: 'nsp_001',
          name: 'Post Matric SC/ST/OBC Scholarship',
          amount: 15000,
          source: 'Government',
          coverage: 'Tuition',
          eligibility: 'SC/ST/OBC, 12th pass',
          deadline: '2026-08-15',
          credibility_score: 0.98,
          awards_available: 100000,
          url: 'https://nsp.gov.in',
        },
      ],
      'iit-scholarships': [
        {
          id: 'iit_001',
          name: 'IIT Merit Scholarship',
          amount: 5000,
          source: 'IIT Delhi',
          coverage: 'Partial Tuition',
          eligibility: 'JEE Advanced 500-5000 rank',
          deadline: '2026-05-20',
          credibility_score: 0.99,
          awards_available: 500,
          url: 'https://home.iitd.ac.in',
        },
      ],
      'nit-scholarships': [
        {
          id: 'nit_001',
          name: 'NIT Merit Scholarship',
          amount: 3000,
          source: 'NIT Trichy',
          coverage: 'Partial Tuition',
          eligibility: 'JEE Advanced 10000-50000 rank',
          deadline: '2026-06-10',
          credibility_score: 0.97,
          awards_available: 1000,
          url: 'https://www.nitt.edu',
        },
      ],
      'state-scholarships': [
        {
          id: 'state_001',
          name: 'Maharashtra State Scholarship',
          amount: 8000,
          source: 'Maharashtra Government',
          coverage: 'Tuition',
          eligibility: 'Maharashtra resident, 12th pass',
          deadline: '2026-07-31',
          credibility_score: 0.95,
          awards_available: 10000,
          url: 'https://maharegjss.gov.in',
        },
      ],
      'csf-scholarships': [
        {
          id: 'csf_001',
          name: 'CSF Merit Scholarship',
          amount: 6000,
          source: 'Career Support Foundation',
          coverage: 'Tuition',
          eligibility: 'GPA > 3.5',
          deadline: '2026-09-15',
          credibility_score: 0.92,
          awards_available: 200,
          url: 'https://csfindia.org',
        },
      ],
    }

    return mockSources[sourceId] || []
  }

  /**
   * Get cached data if still valid
   */
  private getFromCache(key: string): CachedData | null {
    const cached = this.cache.get(key)

    if (!cached) {
      return null
    }

    // Check if cache has expired
    if (new Date() > cached.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return cached
  }

  /**
   * Set cache data
   */
  private setCache(key: string, data: any[], source: string): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      source,
      expiresAt: new Date(Date.now() + this.CACHE_DURATION),
    })
  }

  /**
   * Clear specific cache or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key)
      console.log(`[Cache] Cleared cache for ${key}`)
    } else {
      this.cache.clear()
      console.log('[Cache] Cleared all cache')
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalCacheSize: number
    cacheEntries: number
    sources: string[]
  } {
    return {
      totalCacheSize: this.cache.size,
      cacheEntries: this.cache.size,
      sources: Array.from(this.sources.keys()),
    }
  }

  /**
   * Get source status
   */
  getSourceStatus(): Record<string, { status: string; lastFetch?: string }> {
    const status: Record<string, { status: string; lastFetch?: string }> = {}

    this.sources.forEach((source, sourceId) => {
      status[sourceId] = {
        status: source.status,
        lastFetch: source.lastFetch?.toISOString(),
      }
    })

    return status
  }

  /**
   * Filter scholarships by criteria
   */
  filterScholarships(
    scholarships: any[],
    criteria: {
      minAmount?: number
      maxAmount?: number
      country?: string
      field?: string
      source?: string
      minCredibility?: number
    }
  ): any[] {
    return scholarships.filter((scholarship) => {
      if (criteria.minAmount && scholarship.amount < criteria.minAmount) return false
      if (criteria.maxAmount && scholarship.amount > criteria.maxAmount) return false
      if (criteria.country && scholarship.country !== criteria.country) return false
      if (criteria.field && scholarship.field !== criteria.field) return false
      if (criteria.source && scholarship.source !== criteria.source) return false
      if (criteria.minCredibility && scholarship.credibility_score < criteria.minCredibility) return false
      return true
    })
  }

  /**
   * Rank scholarships by match percentage (based on user profile)
   */
  rankScholarships(
    scholarships: any[],
    userProfile: {
      gpa?: number
      testScore?: number
      familyIncome?: number
      field?: string
      state?: string
    }
  ): any[] {
    const ranked = scholarships.map((scholarship) => {
      let matchScore = 0
      let maxScore = 0

      // GPA matching
      if (userProfile.gpa) {
        maxScore += 30
        if (scholarship.minGPA && userProfile.gpa >= scholarship.minGPA) {
          matchScore += 30
        } else if (scholarship.minGPA) {
          matchScore += Math.max(0, (userProfile.gpa / (scholarship.minGPA || 4)) * 30)
        }
      }

      // Test score matching
      if (userProfile.testScore) {
        maxScore += 30
        if (scholarship.minTestScore && userProfile.testScore >= scholarship.minTestScore) {
          matchScore += 30
        } else if (scholarship.minTestScore) {
          matchScore += Math.max(0, (userProfile.testScore / (scholarship.minTestScore || 100)) * 30)
        }
      }

      // Field matching
      if (userProfile.field === scholarship.field) {
        matchScore += 20
      }
      maxScore += 20

      // Location matching
      if (userProfile.state && scholarship.state === userProfile.state) {
        matchScore += 20
      }
      maxScore += 20

      // Credibility bonus
      matchScore += scholarship.credibility_score * 10
      maxScore += 10

      const percentageMatch = maxScore > 0 ? (matchScore / maxScore) * 100 : 0

      return {
        ...scholarship,
        matchPercentage: Math.round(percentageMatch),
        matchDetails: {
          gpaMatch: userProfile.gpa ? `${userProfile.gpa}/${scholarship.minGPA || 4}` : 'N/A',
          fieldMatch: userProfile.field === scholarship.field,
          locationMatch: userProfile.state === scholarship.state,
        },
      }
    })

    // Sort by match percentage (descending)
    return ranked.sort((a, b) => b.matchPercentage - a.matchPercentage)
  }
}

// Export singleton instance
export const scholarshipFetcher = new ScholarshipDataFetcher()
export default ScholarshipDataFetcher
