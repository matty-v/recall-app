import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CreateProjectDialog } from '@/components/edit-mode/CreateProjectDialog'
import { CreateWikiDialog } from '@/components/edit-mode/CreateWikiDialog'
import { useProjects } from '@/hooks/use-projects'
import { useWikis } from '@/hooks/use-wikis'
import type { Project, Wiki } from '@/lib/types'

interface EditModeProps {
  spreadsheetId: string
}

export function EditMode({ spreadsheetId }: EditModeProps) {
  const { projects, isLoading: projectsLoading, createProject, deleteProject } = useProjects(spreadsheetId)
  const { wikis, isLoading: wikisLoading, createWiki, deleteWiki } = useWikis(spreadsheetId)

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isWikiDialogOpen, setIsWikiDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'project' | 'wiki'; index: number; name: string } | null>(null)

  const handleDeleteClick = (type: 'project' | 'wiki', index: number, name: string) => {
    setItemToDelete({ type, index, name })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      if (itemToDelete.type === 'project') {
        await deleteProject(itemToDelete.index)
      } else {
        await deleteWiki(itemToDelete.index)
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleCreateProject = async (data: Omit<Project, 'id' | 'dateCreated' | 'lastUpdated'>) => {
    await createProject(data)
  }

  const handleCreateWiki = async (data: Omit<Wiki, 'id' | 'dateCreated' | 'lastUpdated'>) => {
    await createWiki(data)
  }

  const isLoading = projectsLoading || wikisLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            <span className="glow-cyan">Projects</span>
          </h2>
          <Button onClick={() => setIsProjectDialogOpen(true)}>
            + New Project
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Folder ID</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>README Doc ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground">
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project, index) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.projectName}</TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>{project.folderId}</TableCell>
                    <TableCell>{project.primaryTags}</TableCell>
                    <TableCell>{project.readmeDocId}</TableCell>
                    <TableCell>{project.briefDescription}</TableCell>
                    <TableCell>{new Date(project.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(project.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick('project', index, project.projectName)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Wikis Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            <span className="glow-purple">Wikis</span>
          </h2>
          <Button onClick={() => setIsWikiDialogOpen(true)}>
            + New Wiki
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Folder ID</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>README Doc ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wikis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No wikis found
                  </TableCell>
                </TableRow>
              ) : (
                wikis.map((wiki, index) => (
                  <TableRow key={wiki.id}>
                    <TableCell className="font-medium">{wiki.topic}</TableCell>
                    <TableCell>{wiki.folderId}</TableCell>
                    <TableCell>{wiki.primaryTags}</TableCell>
                    <TableCell>{wiki.readmeDocId}</TableCell>
                    <TableCell>{wiki.briefDescription}</TableCell>
                    <TableCell>{new Date(wiki.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(wiki.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick('wiki', index, wiki.topic)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onSubmit={handleCreateProject}
      />

      {/* Create Wiki Dialog */}
      <CreateWikiDialog
        open={isWikiDialogOpen}
        onOpenChange={setIsWikiDialogOpen}
        onSubmit={handleCreateWiki}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{itemToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
