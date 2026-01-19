import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SheetsDbClient } from '@/services/sheetsdb'
import { SHEETS_DB_API_URL, PROJECTS_SHEET_NAME } from '@/config/constants'
import type { Project } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export function useProjects(spreadsheetId: string | null) {
  const queryClient = useQueryClient()

  const client = spreadsheetId
    ? new SheetsDbClient({
        baseUrl: SHEETS_DB_API_URL,
        spreadsheetId,
      })
    : null

  const query = useQuery({
    queryKey: ['projects', spreadsheetId],
    queryFn: async () => {
      if (!client) throw new Error('No client')
      return client.getRows<Project>(PROJECTS_SHEET_NAME)
    },
    enabled: !!client,
  })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Project, 'id' | 'dateCreated' | 'lastUpdated'>) => {
      if (!client) throw new Error('No client')
      const now = new Date().toISOString()
      const project: Project = {
        ...data,
        id: uuidv4(),
        dateCreated: now,
        lastUpdated: now,
      }
      await client.createRow(PROJECTS_SHEET_NAME, project)
      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', spreadsheetId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ rowIndex, data }: { rowIndex: number; data: Project }) => {
      if (!client) throw new Error('No client')
      const updated = {
        ...data,
        lastUpdated: new Date().toISOString(),
      }
      await client.updateRow(PROJECTS_SHEET_NAME, rowIndex, updated)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', spreadsheetId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (rowIndex: number) => {
      if (!client) throw new Error('No client')
      await client.deleteRow(PROJECTS_SHEET_NAME, rowIndex)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', spreadsheetId] })
    },
  })

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
  }
}
