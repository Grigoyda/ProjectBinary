import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface Game3Props {
  onBackToMenu: () => void
}

type BaseSystem = 4 | 8 | 16
type ConversionType = 'binary-to-base' | 'base-to-binary'

export function Game3({ onBackToMenu }: Game3Props) {
  const [conversionType, setConversionType] = useState<ConversionType>('binary-to-base')
  const [baseSystem, setBaseSystem] = useState<BaseSystem>(16)
  const [inputNumber, setInputNumber] = useState<string>('')
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })

  // Конвертация десятичного в указанную систему
  const decimalToBase = (num: number, base: BaseSystem): string => {
    return num.toString(base).toUpperCase()
  }

  // Конвертация из указанной системы в десятичное (пока не используется)
  const _baseToDecimal = (num: string, base: BaseSystem): number => {
    return parseInt(num, base)
  }

  // Конвертация десятичного в двоичное
  const decimalToBinary = (num: number): string => {
    return num.toString(2)
  }

  // Конвертация двоичного в десятичное (пока не используется)
  const _binaryToDecimal = (binary: string): number => {
    return parseInt(binary, 2)
  }

  // Получить название системы счисления
  const getBaseName = (base: BaseSystem): string => {
    switch (base) {
      case 4:
        return 'четвертичной (4)'
      case 8:
        return 'восьмеричной (8)'
      case 16:
        return 'шестнадцатеричной (16)'
    }
  }

  // Получить символы для валидации
  const getValidChars = (base: BaseSystem): RegExp => {
    switch (base) {
      case 4:
        return /^[0-3]*$/i
      case 8:
        return /^[0-7]*$/i
      case 16:
        return /^[0-9A-F]*$/i
    }
  }

  // Генерация нового вопроса
  const generateQuestion = useCallback(() => {
    // Случайно выбираем направление конвертации
    const randomType: ConversionType = Math.random() > 0.5 ? 'binary-to-base' : 'base-to-binary'
    // Случайно выбираем систему (4, 8 или 16)
    const bases: BaseSystem[] = [4, 8, 16]
    const randomBase = bases[Math.floor(Math.random() * bases.length)]
    
    setConversionType(randomType)
    setBaseSystem(randomBase)
    setUserAnswer('')
    setResult(null)

    // Генерируем случайное десятичное число (от 0 до 255 для удобства)
    const decimal = Math.floor(Math.random() * 256)

    if (randomType === 'binary-to-base') {
      // Двоичное → другая система
      const binary = decimalToBinary(decimal)
      const baseNumber = decimalToBase(decimal, randomBase)
      setInputNumber(binary)
      setCorrectAnswer(baseNumber)
    } else {
      // Другая система → двоичное
      const baseNumber = decimalToBase(decimal, randomBase)
      const binary = decimalToBinary(decimal)
      setInputNumber(baseNumber)
      setCorrectAnswer(binary)
    }
  }, [])

  // Генерируем первый вопрос при монтировании
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])

  // Проверка ответа (без учета регистра)
  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    const userAnswerTrimmed = userAnswer.trim().toUpperCase()
    const correctAnswerUpper = correctAnswer.toUpperCase()
    const isCorrect = userAnswerTrimmed === correctAnswerUpper

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
    if (conversionType === 'binary-to-base') {
      // Для ответа в другой системе - валидация по выбранной системе
      if (value === '' || getValidChars(baseSystem).test(value)) {
        setUserAnswer(value)
        setResult(null)
      }
    } else {
      // Для двоичного ответа - только 0 и 1
      if (value === '' || /^[01]*$/.test(value)) {
        setUserAnswer(value)
        setResult(null)
      }
    }
  }

  const getInputLabel = () => {
    if (conversionType === 'binary-to-base') {
      return `Введите число в ${getBaseName(baseSystem)} системе`
    } else {
      return 'Введите двоичное число'
    }
  }

  const getInputPlaceholder = () => {
    if (conversionType === 'binary-to-base') {
      switch (baseSystem) {
        case 4:
          return 'Например: 123'
        case 8:
          return 'Например: 377'
        case 16:
          return 'Например: FF'
      }
    } else {
      return 'Например: 11111111'
    }
  }

  const getSystemDisplay = () => {
    if (conversionType === 'binary-to-base') {
      return {
        from: 'двоичной (2)',
        to: getBaseName(baseSystem)
      }
    } else {
      return {
        from: getBaseName(baseSystem),
        to: 'двоичную (2)'
      }
    }
  }

  const systemDisplay = getSystemDisplay()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-2 sm:p-4">
      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок и кнопка назад */}
        <div className="flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Перевод кратных чисел
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Переведите число между двоичной и другими системами
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

        {/* Тип конвертации */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-muted flex-wrap justify-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Перевести из</span>
            <span className="font-mono font-bold text-sm sm:text-lg text-primary">
              {systemDisplay.from}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">в</span>
            <span className="font-mono font-bold text-sm sm:text-lg text-primary">
              {systemDisplay.to}
            </span>
          </div>
        </div>

        {/* Исходное число */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
              Исходное число:
            </p>
            <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-primary break-all">
              {inputNumber}
            </div>
          </div>

          {/* Поле ввода */}
          {!result && (
            <div className="space-y-2">
              <label
                htmlFor="conversion-input"
                className="block text-xs sm:text-sm font-medium text-foreground"
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
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-center text-xl sm:text-2xl font-mono border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase"
                autoFocus
              />
              {conversionType === 'binary-to-base' && baseSystem === 16 && (
                <p className="text-xs text-muted-foreground">
                  Используйте буквы A-F для цифр 10-15
                </p>
              )}
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
                      Твой ответ: <span className="font-mono font-bold">{userAnswer.toUpperCase()}</span>
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

