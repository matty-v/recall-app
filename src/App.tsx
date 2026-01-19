import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Background } from '@/components/layout/Background'
import { SheetsSetupWizard } from '@/components/sheets'
import { ViewMode } from '@/pages/ViewMode'
import { EditMode } from '@/pages/EditMode'
import { useSettings } from '@/hooks/use-settings'
import { SERVICE_ACCOUNT_EMAIL } from '@/config/constants'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function AppContent() {
  const { spreadsheetId, connectSpreadsheet, isInitializing, error } = useSettings()
  const [inputValue, setInputValue] = useState('')

  const handleConnect = async () => {
    await connectSpreadsheet(inputValue)
  }

  if (!spreadsheetId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <Background />
        <div className="relative z-10 w-full">
          <SheetsSetupWizard
            serviceAccountEmail={SERVICE_ACCOUNT_EMAIL}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onConnect={handleConnect}
            isConnecting={isInitializing}
            error={error}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <Background />
      <main className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="glow-cyan">Recall</span>
          </h1>
        </header>

        <Tabs defaultValue="view" className="space-y-6">
          <TabsList>
            <TabsTrigger value="view">View</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <ViewMode spreadsheetId={spreadsheetId} />
          </TabsContent>

          <TabsContent value="edit">
            <EditMode spreadsheetId={spreadsheetId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
