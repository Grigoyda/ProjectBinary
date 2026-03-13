import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface Game4Props {
  onBackToMenu: () => void
}

export function Game4({ onBackToMenu }: Game4Props) {
  const [binaryNum1, setBinaryNum1] = useState<string>('')
  const [binaryNum2, setBinaryNum2] = useState<string>('')
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })

  // Конвертация десятичного в двоичное
  const decimalToBinary = (num: number): string => {
    return num.toString(2)
  }

  // Сложение двоичных чисел
  const addBinary = (bin1: string, bin2: string): string => {
    const num1 = parseInt(bin1, 2)
    const num2 = parseInt(bin2, 2)
    const sum = num1 + num2
    // Ограничиваем результат до 511 (9 бит)
    const limitedSum = Math.min(sum, 511)
    return decimalToBinary(limitedSum)
  }

  // Генерация нового вопроса
  const generateQuestion = useCallback(() => {
    // Генерируем два десятичных числа, чтобы их сумма была не больше 511
    const num1Decimal = Math.floor(Math.random() * 256) // 0-255
    const maxForNum2 = 511 - num1Decimal // Максимум для второго числа
    const num2Decimal = Math.floor(Math.random() * (maxForNum2 + 1)) // 0 до maxForNum2
    
    const bin1 = decimalToBinary(num1Decimal)
    const bin2 = decimalToBinary(num2Decimal)
    const sum = addBinary(bin1, bin2)

    setBinaryNum1(bin1)
    setBinaryNum2(bin2)
    setCorrectAnswer(sum)
    setUserAnswer('')
    setResult(null)
  }, [])

  // Генерируем первый вопрос при монтировании
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])

  // Проверка ответа
  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    const userAnswerTrimmed = userAnswer.trim()
    const isCorrect = userAnswerTrimmed === correctAnswer

    setResult(isCorrect ? 'correct' : 'incorrect')
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }
  }

  // Обработка нажатия Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !result && userAnswer.trim()) {
      checkAnswer()
    }
  }

  // Обработка ввода (валидация - только 0 и 1)
  const handleInputChange = (value: string) => {
    if (value === '' || /^[01]*$/.test(value)) {
      setUserAnswer(value)
      setResult(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-2 sm:p-4">
      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок и кнопка назад */}
        <div className="flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Сложение двоичных чисел
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Сложи два двоичных числа и введи результат
            </p>
          </div>
          <Button variant="outline" onClick={onBackToMenu} className="shrink-0">
            Меню
          </Button>
        </div>

        {/* Счетчик */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50">
            Правильно: <span className="font-bold">{score.correct}</span>
          </div>
          <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50">
            Неправильно: <span className="font-bold">{score.incorrect}</span>
          </div>
        </div>

        {/* Двоичные числа для сложения */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Первое число:</p>
              <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-primary break-all">
                {binaryNum1}
              </div>
            </div>
            
            <div className="text-xl sm:text-2xl font-bold text-foreground">+</div>
            
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Второе число:</p>
              <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-primary break-all">
                {binaryNum2}
              </div>
            </div>
          </div>

          {/* Поле ввода */}
          {!result && (
            <div className="space-y-2 pt-2 sm:pt-4">
              <label
                htmlFor="addition-input"
                className="block text-xs sm:text-sm font-medium text-foreground"
              >
                Результат (в двоичном виде):
              </label>
              <input
                id="addition-input"
                type="text"
                value={userAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сумму"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-center text-xl sm:text-2xl font-mono border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                autoFocus
              />
            </div>
          )}

          {/* Результат */}
          {result && (
            <div className="space-y-3 sm:space-y-4">
              <div
                className={`p-4 sm:p-5 md:p-6 rounded-md border ${
                  result === 'correct'
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50'
                    : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50'
                }`}
              >
                {result === 'correct' ? (
                  <p className="text-xl sm:text-2xl font-bold">✓ Правильно!</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xl sm:text-2xl font-bold">✗ Неправильно</p>
                    <p className="text-xs sm:text-sm">
                      Твой ответ: <span className="font-mono font-bold">{userAnswer}</span>
                    </p>
                    <p className="text-xs sm:text-sm">
                      Правильный ответ: <span className="font-mono font-bold text-base sm:text-lg">{correctAnswer}</span>
                    </p>
                  </div>
                )}
              </div>

              <Button onClick={generateQuestion} className="w-full" size="lg">
                Следующий вопрос
              </Button>
            </div>
          )}

          {/* Кнопка проверки */}
          {!result && (
            <Button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full"
              size="lg"
            >
              Проверить ответ
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
