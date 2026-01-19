import { SearchBar } from '@/components/filters/SearchBar'
import { ProjectCard } from '@/components/view-mode/ProjectCard'
import { WikiCard } from '@/components/view-mode/WikiCard'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/use-projects'
import { useWikis } from '@/hooks/use-wikis'
import { useFilters } from '@/hooks/use-filters'

interface ViewModeProps {
  spreadsheetId: string
}

export function ViewMode({ spreadsheetId }: ViewModeProps) {
  const { projects, isLoading: projectsLoading } = useProjects(spreadsheetId)
  const { wikis, isLoading: wikisLoading } = useWikis(spreadsheetId)

  const {
    filters,
    setSearch,
    clearFilters,
    filterProjects,
    filterWikis,
    hasActiveFilters,
  } = useFilters()

  const filteredProjects = filterProjects(projects)
  const filteredWikis = filterWikis(wikis)

  const isLoading = projectsLoading || wikisLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <SearchBar
          value={filters.search}
          onChange={setSearch}
          placeholder="Search projects and wikis..."
        />
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Projects Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="glow-cyan">Projects</span>
        </h2>
        {filteredProjects.length === 0 ? (
          <p className="text-muted-foreground">No projects found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Wikis Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="glow-purple">Wikis</span>
        </h2>
        {filteredWikis.length === 0 ? (
          <p className="text-muted-foreground">No wikis found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWikis.map((wiki) => (
              <WikiCard key={wiki.id} wiki={wiki} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
