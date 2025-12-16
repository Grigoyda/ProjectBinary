import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface Game6Props {
  onBackToMenu: () => void
}

type NumberSystem = 'binary' | 'decimal' | 'octal' | 'hex'
type Operation = 'add' | 'subtract'

export function Game6({ onBackToMenu }: Game6Props) {
  const [num1, setNum1] = useState<string>('')
  const [num2, setNum2] = useState<string>('')
  const [system1, setSystem1] = useState<NumberSystem>('binary')
  const [system2, setSystem2] = useState<NumberSystem>('octal')
  const [resultSystem, setResultSystem] = useState<NumberSystem>('hex')
  const [operation, setOperation] = useState<Operation>('add')
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
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

  // Получить символ системы
  const getSystemSymbol = (system: NumberSystem): string => {
    switch (system) {
      case 'binary':
        return '₂'
      case 'decimal':
        return '₁₀'
      case 'octal':
        return '₈'
      case 'hex':
        return '₁₆'
    }
  }

  // Получить символы для валидации
  const getValidChars = (system: NumberSystem): RegExp => {
    switch (system) {
      case 'binary':
        return /^[01]*$/i
      case 'decimal':
        return /^\d*$/i
      case 'octal':
        return /^[0-7]*$/i
      case 'hex':
        return /^[0-9A-F]*$/i
    }
  }

  // Генерация нового вопроса
  const generateQuestion = useCallback(() => {
    // Генерируем два десятичных числа (0-127 для удобства вычислений)
    let num1Decimal = Math.floor(Math.random() * 128)
    let num2Decimal = Math.floor(Math.random() * 128)

    // Случайно выбираем операцию
    const randomOp: Operation = Math.random() > 0.5 ? 'add' : 'subtract'
    setOperation(randomOp)

    // Если вычитание, убеждаемся что первое число больше или равно второму
    if (randomOp === 'subtract' && num1Decimal < num2Decimal) {
      [num1Decimal, num2Decimal] = [num2Decimal, num1Decimal]
    }

    // Случайно выбираем системы для чисел
    const systems: NumberSystem[] = ['binary', 'decimal', 'octal', 'hex']
    const randomSystem1 = systems[Math.floor(Math.random() * systems.length)]
    let randomSystem2 = systems[Math.floor(Math.random() * systems.length)]
    
    // Убеждаемся, что системы разные
    while (randomSystem1 === randomSystem2) {
      randomSystem2 = systems[Math.floor(Math.random() * systems.length)]
    }

    // Случайно выбираем систему для результата
    let randomResultSystem = systems[Math.floor(Math.random() * systems.length)]
    // Убеждаемся, что система результата отличается от исходных (для сложности)
    while (randomResultSystem === randomSystem1 || randomResultSystem === randomSystem2) {
      randomResultSystem = systems[Math.floor(Math.random() * systems.length)]
    }

    setSystem1(randomSystem1)
    setSystem2(randomSystem2)
    setResultSystem(randomResultSystem)
    setNum1(numberToSystem(num1Decimal, randomSystem1))
    setNum2(numberToSystem(num2Decimal, randomSystem2))

    // Вычисляем правильный ответ
    let resultDecimal: number
    if (randomOp === 'add') {
      resultDecimal = num1Decimal + num2Decimal
    } else {
      resultDecimal = num1Decimal - num2Decimal
    }

    setCorrectAnswer(numberToSystem(resultDecimal, randomResultSystem))
    setUserAnswer('')
    setResult(null)
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
    if (value === '' || getValidChars(resultSystem).test(value)) {
      setUserAnswer(value)
      setResult(null)
    }
  }

  const getOperationSymbol = () => {
    return operation === 'add' ? '+' : '−'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок и кнопка назад */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Операции в разных системах
            </h1>
            <p className="text-muted-foreground">
              Выполни операцию с числами в разных системах счисления
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

        {/* Уровень сложности */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/50">
            <span className="text-sm font-bold">⚡ Повышенная сложность</span>
          </div>
        </div>

        {/* Выражение */}
        <div className="text-center space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {getSystemName(system1)} система
                </p>
                <div className="text-4xl font-mono font-bold text-primary">
                  {num1}
                  <span className="text-lg text-muted-foreground ml-1">
                    {getSystemSymbol(system1)}
                  </span>
                </div>
              </div>

              <div className="text-4xl font-bold text-foreground">
                {getOperationSymbol()}
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {getSystemName(system2)} система
                </p>
                <div className="text-4xl font-mono font-bold text-primary">
                  {num2}
                  <span className="text-lg text-muted-foreground ml-1">
                    {getSystemSymbol(system2)}
                  </span>
                </div>
              </div>

              <div className="text-4xl font-bold text-foreground">=</div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {getSystemName(resultSystem)} система
                </p>
                {!result ? (
                  <div className="text-4xl font-mono font-bold text-primary min-w-[120px]">
                    ?
                  </div>
                ) : (
                  <div className="text-4xl font-mono font-bold text-primary">
                    {correctAnswer}
                    <span className="text-lg text-muted-foreground ml-1">
                      {getSystemSymbol(resultSystem)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Поле ввода */}
          {!result && (
            <div className="space-y-2 pt-4">
              <label
                htmlFor="operation-input"
                className="block text-sm font-medium text-foreground"
              >
                Введите результат в {getSystemName(resultSystem)} системе:
              </label>
              <input
                id="operation-input"
                type="text"
                value={userAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Например: ${resultSystem === 'hex' ? 'FF' : resultSystem === 'octal' ? '377' : resultSystem === 'binary' ? '11111111' : '255'}`}
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase"
                autoFocus
              />
              {resultSystem === 'hex' && (
                <p className="text-xs text-muted-foreground">
                  Используйте буквы A-F для цифр 10-15
                </p>
              )}
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
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">✓ Правильно!</p>
                    <p className="text-sm text-muted-foreground">
                      Отличная работа! Вы справились со сложной задачей!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">✗ Неправильно</p>
                    <p className="text-sm">
                      Твой ответ: <span className="font-mono font-bold">{userAnswer.toUpperCase()}</span>
                    </p>
                    <p className="text-sm">
                      Правильный ответ: <span className="font-mono font-bold text-lg">{correctAnswer}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Подсказка: конвертируй оба числа в десятичную систему, выполни операцию, затем конвертируй результат в нужную систему
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
