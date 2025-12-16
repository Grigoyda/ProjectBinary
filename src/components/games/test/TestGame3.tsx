import { useState } from 'react'
import { Button } from '../../ui/button'

interface TestGame3Props {
  onBackToMenu: () => void
}

export function TestGame3({ onBackToMenu }: TestGame3Props) {
  const [username, setUsername] = useState<string>('')
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  const handleRegister = () => {
    if (username.trim()) {
      setIsRegistered(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && username.trim()) {
      handleRegister()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              Рейтинг игроков
            </h1>
            <p className="text-muted-foreground">
              Таблица лидеров (в разработке)
            </p>
          </div>
          <Button variant="outline" onClick={onBackToMenu}>
            Меню
          </Button>
        </div>

        {/* Регистрация */}
        {!isRegistered ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Зарегистрируйтесь
              </h2>
              <p className="text-muted-foreground">
                Введите свое имя, чтобы попасть в таблицу лидеров
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-foreground"
                >
                  Имя пользователя:
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-3 text-center text-lg border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleRegister}
                disabled={!username.trim()}
                className="w-full"
                size="lg"
              >
                Зарегистрироваться
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-6 rounded-lg bg-green-500/20 border border-green-500/50">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                ✓ Успешно зарегистрирован!
              </p>
              <p className="text-lg text-foreground">
                Добро пожаловать, <span className="font-bold">{username}</span>!
              </p>
            </div>

            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-4">
                Таблица лидеров находится в разработке
              </p>
              <p className="text-sm">
                Скоро здесь появится рейтинг лучших игроков
              </p>
            </div>

            <Button
              onClick={() => {
                setIsRegistered(false)
                setUsername('')
              }}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Зарегистрировать другого пользователя
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

