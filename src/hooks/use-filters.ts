import { useState } from 'react'
import type { Project, Wiki, FilterState } from '@/lib/types'

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    type: '',
    status: '',
  })

  const setSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }))
  }

  const setTags = (tags: string[]) => {
    setFilters(prev => ({ ...prev, tags }))
  }

  const setType = (type: string) => {
    setFilters(prev => ({ ...prev, type }))
  }

  const setStatus = (status: string) => {
    setFilters(prev => ({ ...prev, status }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      type: '',
      status: '',
    })
  }

  const filterProjects = (projects: Project[]) => {
    return projects.filter(project => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase()
        const matches =
          project.projectName.toLowerCase().includes(search) ||
          project.briefDescription.toLowerCase().includes(search)
        if (!matches) return false
      }

      // Type filter
      if (filters.type && project.type !== filters.type) {
        return false
      }

      // Status filter
      if (filters.status && project.status !== filters.status) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const projectTags = parseTags(project.primaryTags)
        const hasTag = filters.tags.some(tag => projectTags.includes(tag))
        if (!hasTag) return false
      }

      return true
    })
  }

  const filterWikis = (wikis: Wiki[]) => {
    return wikis.filter(wiki => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase()
        const matches =
          wiki.topic.toLowerCase().includes(search) ||
          wiki.briefDescription.toLowerCase().includes(search)
        if (!matches) return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const wikiTags = parseTags(wiki.primaryTags)
        const hasTag = filters.tags.some(tag => wikiTags.includes(tag))
        if (!hasTag) return false
      }

      return true
    })
  }

  const getAllTags = (projects: Project[], wikis: Wiki[]) => {
    const allTags = new Set<string>()

    projects.forEach(p => {
      parseTags(p.primaryTags).forEach(tag => allTags.add(tag))
    })

    wikis.forEach(w => {
      parseTags(w.primaryTags).forEach(tag => allTags.add(tag))
    })

    return Array.from(allTags).sort()
  }

  const getAllTypes = (projects: Project[]) => {
    return Array.from(new Set(projects.map(p => p.type))).sort()
  }

  const getAllStatuses = (projects: Project[]) => {
    return Array.from(new Set(projects.map(p => p.status))).sort()
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.tags.length > 0 ||
    filters.type !== '' ||
    filters.status !== ''

  return {
    filters,
    setSearch,
    setTags,
    setType,
    setStatus,
    clearFilters,
    filterProjects,
    filterWikis,
    getAllTags,
    getAllTypes,
    getAllStatuses,
    hasActiveFilters,
  }
}
