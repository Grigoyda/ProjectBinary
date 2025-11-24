import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface Game5Props {
  onBackToMenu: () => void
}

type NumberSystem = 'binary' | 'decimal' | 'octal' | 'hex'

export function Game5({ onBackToMenu }: Game5Props) {
  const [num1, setNum1] = useState<string>('')
  const [num2, setNum2] = useState<string>('')
  const [system1, setSystem1] = useState<NumberSystem>('binary')
  const [system2, setSystem2] = useState<NumberSystem>('decimal')
  const [userChoice, setUserChoice] = useState<'first' | 'second' | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<'first' | 'second'>('first')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })

  // Конвертация числа в строку в указанной системе
  const numberToSystem = (num: number, system: NumberSystem): string => {
    switch (system) {
      case 'binary':
        return num.toString(2)
      case 'decimal':
        return num.toString(10)
      case 'octal':
        return num.toString(8)
      case 'hex':
        return num.toString(16).toUpperCase()
      default:
        return num.toString(10)
    }
  }

  // Получить название системы
  const getSystemName = (system: NumberSystem): string => {
    switch (system) {
      case 'binary':
        return 'двоичной'
      case 'decimal':
        return 'десятичной'
      case 'octal':
        return 'восьмеричной'
      case 'hex':
        return 'шестнадцатеричной'
    }
  }

  // Генерация нового вопроса
  const generateQuestion = useCallback(() => {
    // Генерируем два разных десятичных числа (0-255)
    let num1Decimal = Math.floor(Math.random() * 256)
    let num2Decimal = Math.floor(Math.random() * 256)
    
    // Убеждаемся, что числа разные
    while (num1Decimal === num2Decimal) {
      num2Decimal = Math.floor(Math.random() * 256)
    }

    // Случайно выбираем системы для каждого числа
    const systems: NumberSystem[] = ['binary', 'decimal', 'octal', 'hex']
    const randomSystem1 = systems[Math.floor(Math.random() * systems.length)]
    let randomSystem2 = systems[Math.floor(Math.random() * systems.length)]
    
    // Убеждаемся, что системы разные для наглядности
    while (randomSystem1 === randomSystem2 && systems.length > 1) {
      randomSystem2 = systems[Math.floor(Math.random() * systems.length)]
    }

    setSystem1(randomSystem1)
    setSystem2(randomSystem2)
    setNum1(numberToSystem(num1Decimal, randomSystem1))
    setNum2(numberToSystem(num2Decimal, randomSystem2))
    setCorrectAnswer(num1Decimal > num2Decimal ? 'first' : 'second')
    setUserChoice(null)
    setResult(null)
  }, [])

  // Генерируем первый вопрос при монтировании
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])

  // Обработка выбора
  const handleChoice = (choice: 'first' | 'second') => {
    if (result !== null) return

    setUserChoice(choice)
    const isCorrect = choice === correctAnswer
    setResult(isCorrect ? 'correct' : 'incorrect')
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок и кнопка назад */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Сравнение чисел
            </h1>
            <p className="text-muted-foreground">
              Определи, какое число больше
            </p>
          </div>
          <Button variant="outline" onClick={onBackToMenu}>
            Меню
          </Button>
        </div>

        {/* Счетчик */}
        <div className="flex justify-center gap-4 text-sm">
          <div className="px-4 py-2 rounded-md bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50">
            Правильно: <span className="font-bold">{score.correct}</span>
          </div>
          <div className="px-4 py-2 rounded-md bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50">
            Неправильно: <span className="font-bold">{score.incorrect}</span>
          </div>
        </div>

        {/* Вопрос */}
        <div className="text-center space-y-6">
          <p className="text-lg font-medium text-foreground">
            Какое число больше?
          </p>

          {/* Два числа */}
          {!result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice('first')}
                className="p-6 rounded-lg border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  В {getSystemName(system1)} системе:
                </p>
                <div className="text-4xl font-mono font-bold text-primary">
                  {num1}
                </div>
              </button>
              
              <button
                onClick={() => handleChoice('second')}
                className="p-6 rounded-lg border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  В {getSystemName(system2)} системе:
                </p>
                <div className="text-4xl font-mono font-bold text-primary">
                  {num2}
                </div>
              </button>
            </div>
          )}

          {/* Результат */}
          {result && (
            <div className="space-y-4">
              <div
                className={`p-6 rounded-md border ${
                  result === 'correct'
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50'
                    : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50'
                }`}
              >
                {result === 'correct' ? (
                  <p className="text-2xl font-bold">✓ Правильно!</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">✗ Неправильно</p>
                    <p className="text-sm">
                      Правильный ответ: <span className="font-bold">
                        {correctAnswer === 'first' ? 'Первое число больше' : 'Второе число больше'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Показываем числа еще раз с пометкой */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-lg border-2 ${
                    correctAnswer === 'first'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border bg-background'
                  }`}
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    В {getSystemName(system1)} системе:
                  </p>
                  <div className="text-4xl font-mono font-bold text-primary">
                    {num1}
                  </div>
                  {correctAnswer === 'first' && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-bold">
                      ✓ Больше
                    </p>
                  )}
                </div>
                
                <div
                  className={`p-6 rounded-lg border-2 ${
                    correctAnswer === 'second'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border bg-background'
                  }`}
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    В {getSystemName(system2)} системе:
                  </p>
                  <div className="text-4xl font-mono font-bold text-primary">
                    {num2}
                  </div>
                  {correctAnswer === 'second' && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-bold">
                      ✓ Больше
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={generateQuestion} className="w-full" size="lg">
                Следующий вопрос
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
