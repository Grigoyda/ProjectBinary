import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface Game2Props {
  onBackToMenu: () => void
}

type ConversionType = 'binary-to-decimal' | 'decimal-to-binary'

export function Game2({ onBackToMenu }: Game2Props) {
  const [conversionType, setConversionType] = useState<ConversionType>('decimal-to-binary')
  const [inputNumber, setInputNumber] = useState<string>('')
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })

  // Конвертация десятичного в двоичное
  const decimalToBinary = (num: number): string => {
    return num.toString(2)
  }

  // Конвертация двоичного в десятичное
  const binaryToDecimal = (binary: string): number => {
    return parseInt(binary, 2)
  }

  // Генерация нового вопроса
  const generateQuestion = useCallback(() => {
    const randomType: ConversionType = Math.random() > 0.5 ? 'decimal-to-binary' : 'binary-to-decimal'
    setConversionType(randomType)
    setUserAnswer('')
    setResult(null)

    if (randomType === 'decimal-to-binary') {
      // Генерируем десятичное число от 0 до 511
      const decimal = Math.floor(Math.random() * 512)
      setInputNumber(decimal.toString())
      setCorrectAnswer(decimalToBinary(decimal))
    } else {
      // Генерируем двоичное число
      // Сначала генерируем десятичное, затем конвертируем в двоичное
      const decimal = Math.floor(Math.random() * 512)
      const binary = decimalToBinary(decimal)
      setInputNumber(binary)
      setCorrectAnswer(decimal.toString())
    }
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

  // Обработка ввода (валидация)
  const handleInputChange = (value: string) => {
    if (conversionType === 'decimal-to-binary') {
      // Для двоичного ответа - только 0 и 1
      if (value === '' || /^[01]*$/.test(value)) {
        setUserAnswer(value)
        setResult(null)
      }
    } else {
      // Для десятичного ответа - только цифры
      if (value === '' || /^\d*$/.test(value)) {
        setUserAnswer(value)
        setResult(null)
      }
    }
  }

  const getInputLabel = () => {
    return conversionType === 'decimal-to-binary' 
      ? 'Введите двоичное число'
      : 'Введите десятичное число'
  }

  const getInputPlaceholder = () => {
    return conversionType === 'decimal-to-binary' 
      ? 'Например: 1011'
      : 'Например: 255'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок и кнопка назад */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Конвертация чисел
            </h1>
            <p className="text-muted-foreground">
              Переведите число в нужную систему счисления
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

        {/* Тип конвертации */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-muted">
            <span className="text-sm text-muted-foreground">Перевести из</span>
            <span className="font-mono font-bold text-lg text-primary">
              {conversionType === 'decimal-to-binary' ? 'десятичной' : 'двоичной'}
            </span>
            <span className="text-sm text-muted-foreground">в</span>
            <span className="font-mono font-bold text-lg text-primary">
              {conversionType === 'decimal-to-binary' ? 'двоичную' : 'десятичную'}
            </span>
          </div>
        </div>

        {/* Исходное число */}
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {conversionType === 'decimal-to-binary' ? 'Десятичное число' : 'Двоичное число'}:
            </p>
            <div className="text-6xl font-mono font-bold text-primary">
              {inputNumber}
            </div>
          </div>

          {/* Поле ввода */}
          {!result && (
            <div className="space-y-2">
              <label
                htmlFor="conversion-input"
                className="block text-sm font-medium text-foreground"
              >
                {getInputLabel()}:
              </label>
              <input
                id="conversion-input"
                type="text"
                value={userAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getInputPlaceholder()}
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                autoFocus
              />
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
                      Твой ответ: <span className="font-mono font-bold">{userAnswer}</span>
                    </p>
                    <p className="text-sm">
                      Правильный ответ: <span className="font-mono font-bold text-lg">{correctAnswer}</span>
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

