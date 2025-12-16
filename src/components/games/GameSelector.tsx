type GameId = 'binary-guessing' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6' | 'test-games'

interface GameSelectorProps {
  onSelectGame: (gameId: GameId) => void
}

const games = [
  { id: 'binary-guessing' as GameId, name: 'Угадывание двоичного', description: 'Выбери правильный двоичный ответ за 10 секунд' },
  { id: 'game2' as GameId, name: 'Конвертация чисел', description: 'Перевод двоичных - десятичных' },
  { id: 'game3' as GameId, name: 'Перевод кратных чисел', description: 'Конвертация между двоичной и 4/8/16-ричной' },
  { id: 'game4' as GameId, name: 'Сложение двоичных', description: 'Сложи два двоичных числа' },
  { id: 'game5' as GameId, name: 'Сравнение чисел', description: 'Определи, какое число больше' },
  { id: 'game6' as GameId, name: 'Операции в разных системах', description: '⚡ Повышенная сложность: операции с числами в разных системах' },
  { id: 'test-games' as GameId, name: 'Тестовые игры', description: '' },
]

export function GameSelector({ onSelectGame }: GameSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Игры про системы счисления
          </h1>
          <p className="text-muted-foreground">
            Выберите игру для начала
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              disabled={game.id !== 'binary-guessing' && game.id !== 'game2' && game.id !== 'game3' && game.id !== 'game4' && game.id !== 'game5' && game.id !== 'game6' && game.id !== 'test-games'}
              className="p-6 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

