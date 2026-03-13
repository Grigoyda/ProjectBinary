import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface BinaryGuessingGameProps {
  onBackToMenu: () => void
}

export function BinaryGuessingGame({ onBackToMenu }: BinaryGuessingGameProps) {
  const [currentNumber, setCurrentNumber] = useState<number>(0)
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState<number>(10)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [score, setScore] = useState({ correct: 0, incorrect: 0, skipped: 0 })
  const [isGameActive, setIsGameActive] = useState<boolean>(false)

  // Конвертация десятичного в двоичное
  const decimalToBinary = (num: number): string => {
    return num.toString(2)
  }

  // Генерация неправильных ответов
  const generateWrongAnswers = (correct: string): string[] => {
    const correctNum = parseInt(correct, 2)
    const wrongAnswers: string[] = []

    // Генерируем 2 неправильных ответа
    while (wrongAnswers.length < 2) {
      // Генерируем число в похожем диапазоне (±10-50 от правильного)
      const offset = Math.floor(Math.random() * 40) + 10
      const sign = Math.random() > 0.5 ? 1 : -1
      let wrongNum = correctNum + offset * sign

      // Убеждаемся, что число в допустимом диапазоне (0-511)
      wrongNum = Math.max(0, Math.min(511, wrongNum))
      const wrongBinary = decimalToBinary(wrongNum)

      // Проверяем, что это не правильный ответ и еще не добавлен
      if (wrongBinary !== correct && !wrongAnswers.includes(wrongBinary)) {
        wrongAnswers.push(wrongBinary)
      }
    }

    return wrongAnswers
  }

  // Перемешивание массива (алгоритм Фишера-Йетса)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Генерация нового вопроса
  const generateQuestion = useCallback(() => {
    const randomNum = Math.floor(Math.random() * 512) // 0-511
    const correct = decimalToBinary(randomNum)
    const wrongAnswers = generateWrongAnswers(correct)
    const allOptions = shuffleArray([correct, ...wrongAnswers])

    setCurrentNumber(randomNum)
    setCorrectAnswer(correct)
    setOptions(allOptions)
    setTimeLeft(10)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsGameActive(true)
  }, [])

  // Таймер
  useEffect(() => {
    if (!isGameActive || isAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false)
          setIsAnswered(true)
          setScore((s) => ({ ...s, skipped: s.skipped + 1 }))
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameActive, isAnswered])

  // Генерируем первый вопрос при монтировании
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])

  // Обработка выбора ответа
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)
    setIsGameActive(false)

    if (answer === correctAnswer) {
      setScore((s) => ({ ...s, correct: s.correct + 1 }))
    } else {
      setScore((s) => ({ ...s, incorrect: s.incorrect + 1 }))
    }
  }

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    generateQuestion()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-2 sm:p-4">
      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок и кнопка назад */}
        <div className="flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Угадывание двоичного числа
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Выбери правильный ответ за 10 секунд
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
          <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-secondary text-secondary-foreground">
            Пропущено: <span className="font-bold">{score.skipped}</span>
          </div>
        </div>

        {/* Таймер */}
        <div className="text-center">
          <div
            className={`text-4xl sm:text-5xl md:text-6xl font-bold transition-all ${
              timeLeft <= 2
                ? 'text-red-500 animate-pulse'
                : timeLeft <= 3
                  ? 'text-orange-500'
                  : 'text-primary'
            }`}
          >
            {timeLeft}
          </div>
        </div>

        {/* Десятичное число */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
              Десятичное число:
            </p>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary">
              {currentNumber}
            </div>
          </div>

          {/* Варианты ответов */}
          {!isAnswered && (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Выбери двоичное представление:
              </p>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    variant="outline"
                    size="lg"
                    className="w-full text-base sm:text-lg md:text-xl font-mono py-4 sm:py-5 md:py-6"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Результат */}
          {isAnswered && (
            <div className="space-y-3 sm:space-y-4">
              <div
                className={`p-4 sm:p-5 md:p-6 rounded-md border ${
                  selectedAnswer === correctAnswer
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50'
                    : selectedAnswer === null
                      ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/50'
                      : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50'
                }`}
              >
                {selectedAnswer === correctAnswer ? (
                  <p className="text-xl sm:text-2xl font-bold">✓ Правильно!</p>
                ) : selectedAnswer === null ? (
                  <p className="text-xl sm:text-2xl font-bold">⏱ Время вышло</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xl sm:text-2xl font-bold">✗ Неправильно</p>
                    <p className="text-xs sm:text-sm">
                      Твой ответ: <span className="font-mono font-bold">{selectedAnswer}</span>
                    </p>
                  </div>
                )}
                <p className="text-xs sm:text-sm mt-2">
                  Правильный ответ: <span className="font-mono font-bold text-base sm:text-lg">{correctAnswer}</span>
                </p>
              </div>

              <Button onClick={handleNextQuestion} className="w-full" size="lg">
                Следующий вопрос
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

