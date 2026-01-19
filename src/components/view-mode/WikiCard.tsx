import { Folder, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import type { Wiki } from '@/lib/types'
import { launchClaude } from '@/lib/claude'
import { getFolderUrl, getDocUrl } from '@/lib/links'

interface WikiCardProps {
  wiki: Wiki
}

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

export function WikiCard({ wiki }: WikiCardProps) {
  const tags = parseTags(wiki.primaryTags)

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) {
      return
    }
    launchClaude(wiki)
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
          <CardTitle className="glow-purple">{wiki.topic}</CardTitle>
          <div className="flex gap-1">
            <button
              onClick={(e) => handleLinkClick(e, getFolderUrl(wiki.folderId))}
              className="text-muted-foreground hover:text-accent-purple transition-colors"
              title="Open folder"
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => handleLinkClick(e, getDocUrl(wiki.readmeDocId))}
              className="text-muted-foreground hover:text-accent-purple transition-colors"
              title="Open README"
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
        <CardDescription>{wiki.briefDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
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
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Click to launch Claude.ai
      </CardFooter>
    </Card>
  )
}
