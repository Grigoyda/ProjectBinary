import { Button } from '../../ui/button'

type TestGameId = 'test1' | 'test2' | 'test3'

interface TestGamesSelectorProps {
  onSelectGame: (gameId: TestGameId) => void
  onBackToMenu: () => void
}

const testGames = [
  { id: 'test1' as TestGameId, name: 'Блоки с цифрами', description: 'Составь число из блоков цифр' },
  { id: 'test2' as TestGameId, name: 'Сравнение чисел', description: 'Сравни числа в разных системах (2-10)' },
  { id: 'test3' as TestGameId, name: 'Рейтинг игроков', description: 'Таблица лидеров' },
]

export function TestGamesSelector({ onSelectGame, onBackToMenu }: TestGamesSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2 flex-1">
            <h1 className="text-4xl font-bold text-foreground">
              Тестовые игры
            </h1>
            <p className="text-muted-foreground">
              Экспериментальные режимы игры
            </p>
          </div>
          <Button variant="outline" onClick={onBackToMenu}>
            Назад
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testGames.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="p-6 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all text-left cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
              <p className="text-sm text-muted-foreground">{game.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export type { TestGameId }

