import { Button } from '../ui/button'

interface Game6Props {
  onBackToMenu: () => void
}

export function Game6({ onBackToMenu }: Game6Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Игра 6</h1>
          <Button variant="outline" onClick={onBackToMenu}>
            Меню
          </Button>
        </div>
        <div className="text-center text-muted-foreground">
          <p>Игра будет добавлена позже</p>
        </div>
      </div>
    </div>
  )
}

