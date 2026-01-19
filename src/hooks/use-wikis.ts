import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SheetsDbClient } from '@/services/sheetsdb'
import { SHEETS_DB_API_URL, WIKIS_SHEET_NAME } from '@/config/constants'
import type { Wiki } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export function useWikis(spreadsheetId: string | null) {
  const queryClient = useQueryClient()

  const client = spreadsheetId
    ? new SheetsDbClient({
        baseUrl: SHEETS_DB_API_URL,
        spreadsheetId,
      })
    : null

  const query = useQuery({
    queryKey: ['wikis', spreadsheetId],
    queryFn: async () => {
      if (!client) throw new Error('No client')
      return client.getRows<Wiki>(WIKIS_SHEET_NAME)
    },
    enabled: !!client,
  })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Wiki, 'id' | 'dateCreated' | 'lastUpdated'>) => {
      if (!client) throw new Error('No client')
      const now = new Date().toISOString()
      const wiki: Wiki = {
        ...data,
        id: uuidv4(),
        dateCreated: now,
        lastUpdated: now,
      }
      await client.createRow(WIKIS_SHEET_NAME, wiki)
      return wiki
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wikis', spreadsheetId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ rowIndex, data }: { rowIndex: number; data: Wiki }) => {
      if (!client) throw new Error('No client')
      const updated = {
        ...data,
        lastUpdated: new Date().toISOString(),
      }
      await client.updateRow(WIKIS_SHEET_NAME, rowIndex, updated)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wikis', spreadsheetId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (rowIndex: number) => {
      if (!client) throw new Error('No client')
      await client.deleteRow(WIKIS_SHEET_NAME, rowIndex)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wikis', spreadsheetId] })
    },
  })

  return {
    wikis: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createWiki: createMutation.mutateAsync,
    updateWiki: updateMutation.mutateAsync,
    deleteWiki: deleteMutation.mutateAsync,
  }
}
