// @ts-expect-error - useEffect required by spec but not yet used
import { useState, useEffect } from 'react'
import { SheetsDbClient } from '@/services/sheetsdb'
import { SHEETS_DB_API_URL, PROJECTS_SHEET_NAME, WIKIS_SHEET_NAME } from '@/config/constants'
import type { Settings } from '@/lib/types'

const SETTINGS_KEY = 'recall-settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const spreadsheetId = settings?.spreadsheetId || null

  const connectSpreadsheet = async (id: string) => {
    setIsInitializing(true)
    setError(null)

    try {
      // Create client
      const client = new SheetsDbClient({
        baseUrl: SHEETS_DB_API_URL,
        spreadsheetId: id,
      })

      // Validate connection
      await client.health()

      // Validate sheets exist
      const sheets = await client.listSheets()
      const hasProjects = sheets.some(s => s.title === PROJECTS_SHEET_NAME)
      const hasWikis = sheets.some(s => s.title === WIKIS_SHEET_NAME)

      if (!hasProjects || !hasWikis) {
        throw new Error(`Missing required sheets. Found: ${sheets.map(s => s.title).join(', ')}`)
      }

      // Save settings
      const newSettings: Settings = {
        spreadsheetId: id,
        lastValidated: new Date().toISOString(),
      }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      setSettings(newSettings)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect'
      setError(message)
      throw err
    } finally {
      setIsInitializing(false)
    }
  }

  const disconnect = () => {
    localStorage.removeItem(SETTINGS_KEY)
    setSettings(null)
  }

  return {
    spreadsheetId,
    settings,
    isInitializing,
    error,
    connectSpreadsheet,
    disconnect,
  }
}
