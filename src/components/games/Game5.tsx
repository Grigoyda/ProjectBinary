import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface Game5Props {
  onBackToMenu: () => void
}

type NumberSystem = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export function Game5({ onBackToMenu }: Game5Props) {
  const [num1, setNum1] = useState<string>('')
  const [num2, setNum2] = useState<string>('')
  const [system1, setSystem1] = useState<NumberSystem>(2)
  const [system2, setSystem2] = useState<NumberSystem>(10)
  const [_userChoice, setUserChoice] = useState<'greater' | 'less' | 'equal' | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<'greater' | 'less' | 'equal'>('greater')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [comparisonSign, setComparisonSign] = useState<'>' | '<' | '='>('>')

  const numberToSystem = (num: number, base: NumberSystem): string => {
    return num.toString(base).toUpperCase()
  }

  const getSystemName = (base: NumberSystem): string => {
    const names: { [key: number]: string } = {
      2: 'двоичной',
      3: 'троичной',
      4: 'четверичной',
      5: 'пятеричной',
      6: 'шестеричной',
      7: 'семеричной',
      8: 'восьмеричной',
      9: 'девятеричной',
      10: 'десятичной',
    }
    return names[base]
  }

  const generateQuestion = useCallback(() => {
    let num1Decimal = Math.floor(Math.random() * 256)
    let num2Decimal = Math.floor(Math.random() * 256)

    while (num1Decimal === num2Decimal) {
      num2Decimal = Math.floor(Math.random() * 256)
    }

    const systems: NumberSystem[] = [2, 3, 4, 5, 6, 7, 8, 9, 10]
    const randomSystem1 = systems[Math.floor(Math.random() * systems.length)]
    let randomSystem2 = systems[Math.floor(Math.random() * systems.length)]

    while (randomSystem1 === randomSystem2) {
      randomSystem2 = systems[Math.floor(Math.random() * systems.length)]
    }

    setSystem1(randomSystem1)
    setSystem2(randomSystem2)
    setNum1(numberToSystem(num1Decimal, randomSystem1))
    setNum2(numberToSystem(num2Decimal, randomSystem2))

    if (num1Decimal > num2Decimal) {
      setCorrectAnswer('greater')
    } else if (num1Decimal < num2Decimal) {
      setCorrectAnswer('less')
    } else {
      setCorrectAnswer('equal')
    }

    setUserChoice(null)
    setResult(null)
    setComparisonSign('>')
  }, [])

  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])

  const toggleSign = () => {
    if (result !== null) return

    if (comparisonSign === '>') {
      setComparisonSign('<')
    } else if (comparisonSign === '<') {
      setComparisonSign('=')
    } else {
      setComparisonSign('>')
    }
  }

  const checkAnswer = () => {
    if (result !== null) return

    let choice: 'greater' | 'less' | 'equal'
    if (comparisonSign === '>') {
      choice = 'greater'
    } else if (comparisonSign === '<') {
      choice = 'less'
    } else {
      choice = 'equal'
    }

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
    <div className="min-h-screen flex items-center justify-center bg-background p-2 sm:p-4">
      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 rounded-lg border border-border bg-card shadow-lg">
        <div className="flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Сравнение чисел (2-10)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Определи, какое число больше
            </p>
          </div>
          <Button variant="outline" onClick={onBackToMenu} className="shrink-0">
            Меню
          </Button>
        </div>

        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50">
            Правильно: <span className="font-bold">{score.correct}</span>
          </div>
          <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50">
            Неправильно: <span className="font-bold">{score.incorrect}</span>
          </div>
        </div>

        <div className="text-center space-y-4 sm:space-y-6">
          <p className="text-base sm:text-lg font-medium text-foreground">
            Какое число больше?
          </p>

          {!result && (
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              <div className="p-3 sm:p-4 md:p-6 rounded-lg border-2 border-primary bg-primary/10">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  В {getSystemName(system1)} системе:
                </p>
                <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-primary break-all">
                  {num1}
                </div>
                <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                  Основание: {system1}
                </p>
              </div>

              <button
                onClick={toggleSign}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary hover:text-primary/80 transition-all cursor-pointer px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg border-2 border-primary bg-primary/10 hover:bg-primary/20"
              >
                {comparisonSign}
              </button>
              
              <div className="p-3 sm:p-4 md:p-6 rounded-lg border-2 border-primary bg-primary/10">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  В {getSystemName(system2)} системе:
                </p>
                <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-primary break-all">
                  {num2}
                </div>
                <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                  Основание: {system2}
                </p>
              </div>
            </div>
          )}

          {!result && (
            <Button onClick={checkAnswer} className="w-full" size="lg">
              Проверить ответ
            </Button>
          )}

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
                      Правильный ответ: <span className="font-bold">
                        {correctAnswer === 'greater'
                          ? 'Первое число больше (>)'
                          : correctAnswer === 'less'
                            ? 'Первое число меньше (<)'
                            : 'Числа равны (=)'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                <div className="p-3 sm:p-4 md:p-6 rounded-lg border-2 border-border bg-background">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                    В {getSystemName(system1)} системе:
                  </p>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-primary break-all">
                    {num1}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                    Основание: {system1}
                  </p>
                </div>

                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-600 dark:text-green-400 px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg border-2 border-green-500 bg-green-500/10">
                  {correctAnswer === 'greater' ? '>' : correctAnswer === 'less' ? '<' : '='}
                </div>
                
                <div className="p-3 sm:p-4 md:p-6 rounded-lg border-2 border-border bg-background">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                    В {getSystemName(system2)} системе:
                  </p>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-primary break-all">
                    {num2}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                    Основание: {system2}
                  </p>
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
