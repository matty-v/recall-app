import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Wiki } from '@/lib/types'

interface CreateWikiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Wiki, 'id' | 'dateCreated' | 'lastUpdated'>) => Promise<void>
}

export function CreateWikiDialog({ open, onOpenChange, onSubmit }: CreateWikiDialogProps) {
  const [formData, setFormData] = useState({
    topic: '',
    folderId: '',
    primaryTags: '',
    readmeDocId: '',
    briefDescription: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        topic: '',
        folderId: '',
        primaryTags: '',
        readmeDocId: '',
        briefDescription: '',
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create wiki:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Wiki</DialogTitle>
          <DialogDescription>
            Fill in the details for the new wiki
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Topic *</label>
            <Input
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Folder ID</label>
            <Input
              value={formData.folderId}
              onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tags (comma-separated) *</label>
            <Input
              value={formData.primaryTags}
              onChange={(e) => setFormData({ ...formData, primaryTags: e.target.value })}
              placeholder="tag1, tag2, tag3"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">README Doc ID</label>
            <Input
              value={formData.readmeDocId}
              onChange={(e) => setFormData({ ...formData, readmeDocId: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Brief Description</label>
            <Input
              value={formData.briefDescription}
              onChange={(e) => setFormData({ ...formData, briefDescription: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
