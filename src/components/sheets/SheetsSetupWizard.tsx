import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SheetsSetupWizardProps {
  serviceAccountEmail: string
  inputValue: string
  onInputChange: (value: string) => void
  onConnect: () => Promise<void>
  isConnecting?: boolean
  error?: string | null
}

export function SheetsSetupWizard({
  serviceAccountEmail,
  inputValue,
  onInputChange,
  onConnect,
  isConnecting = false,
  error,
}: SheetsSetupWizardProps) {
  const handleConnect = async () => {
    await onConnect()
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          <span className="glow-cyan">Recall</span>
        </h1>
        <p className="text-muted-foreground">Connect your Google Sheet to get started</p>
      </div>

      <div className="tech-card p-6 rounded-xl">
        <ol className="list-decimal list-inside space-y-3 text-sm mb-6">
          <li>Open your Google Sheet with "projects" and "wikis" tabs</li>
          <li>
            Share it with:
            <code className="block mt-2 p-3 bg-secondary rounded text-xs break-all select-all">
              {serviceAccountEmail}
            </code>
            <span className="text-muted-foreground text-xs">(Editor access required)</span>
          </li>
          <li>Copy the Sheet ID from the URL</li>
          <li>Paste below and click Connect</li>
        </ol>

        <div className="space-y-3">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Paste your Google Sheet ID here"
            className="w-full"
          />
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <Button
            onClick={handleConnect}
            disabled={!inputValue || isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </div>
    </div>
  )
}
