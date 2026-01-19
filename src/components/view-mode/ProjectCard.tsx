import { Folder, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import type { Project } from '@/lib/types'
import { launchClaude } from '@/lib/claude'
import { getFolderUrl, getDocUrl } from '@/lib/links'

interface ProjectCardProps {
  project: Project
}

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tags = parseTags(project.primaryTags)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking a link
    if ((e.target as HTMLElement).closest('a, button')) {
      return
    }
    launchClaude(project)
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card
      className="tech-card cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="glow-cyan">{project.projectName}</CardTitle>
          <div className="flex gap-1">
            <button
              onClick={(e) => handleLinkClick(e, getFolderUrl(project.folderId))}
              className="text-muted-foreground hover:text-accent-cyan transition-colors"
              title="Open folder"
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => handleLinkClick(e, getDocUrl(project.readmeDocId))}
              className="text-muted-foreground hover:text-accent-cyan transition-colors"
              title="Open README"
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
        <CardDescription>{project.briefDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex gap-2">
            <span className="tech-badge text-xs px-2 py-1 rounded-md">
              {project.type}
            </span>
            <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
              {project.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="tech-badge text-xs px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Click to launch Claude.ai
      </CardFooter>
    </Card>
  )
}
