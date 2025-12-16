import { useState, useEffect, useCallback } from 'react'
import { Button } from '../../ui/button'

interface TestGame1Props {
  onBackToMenu: () => void
}

type NumberSystem = 2 | 3 | 4 | 5

export function TestGame1({ onBackToMenu }: TestGame1Props) {
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [targetSystem, setTargetSystem] = useState<NumberSystem>(2)
  const [blocks, setBlocks] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState<string[]>([])
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([])
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })

  // Конвертация числа в нужную систему
  const numberToSystem = (num: number, base: NumberSystem): string => {
    return num.toString(base).toUpperCase()
  }

  // Получить название системы
  const getSystemName = (base: NumberSystem): string => {
    switch (base) {
      case 2:
        return 'двоичной'
      case 3:
        return 'троичной'
      case 4:
        return 'четверичной'
      case 5:
        return 'пятеричной'
    }
  }

  // Получить все возможные символы для системы
  const getSystemChars = (base: NumberSystem): string[] => {
    const chars: string[] = []
    for (let i = 0; i < base; i++) {
      chars.push(i < 10 ? i.toString() : String.fromCharCode(65 + i - 10))
    }
    return chars
  }

  // Перемешать массив
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
    // Выбираем случайную систему
    const systems: NumberSystem[] = [2, 3, 4, 5]
    const randomSystem = systems[Math.floor(Math.random() * systems.length)]
    setTargetSystem(randomSystem)

    // Генерируем число (от 0 до 100 для удобства)
    const randomNumber = Math.floor(Math.random() * 101)
    setTargetNumber(randomNumber)

    // Конвертируем в нужную систему
    const correctAnswer = numberToSystem(randomNumber, randomSystem)
    
    // Создаем блоки (разбиваем на блоки по 1-2 символа, минимум 2 блока)
    const answerBlocks: string[] = []
    let i = 0
    
    // Гарантируем минимум 2 блока
    if (correctAnswer.length === 1) {
      // Если число однозначное, добавляем ведущий ноль
      answerBlocks.push('0')
      answerBlocks.push(correctAnswer)
    } else {
      // Разбиваем на блоки
      while (i < correctAnswer.length) {
        // Определяем размер блока (1-2 символа)
        let blockSize: number
        const remaining = correctAnswer.length - i
        
        if (remaining === 1) {
          blockSize = 1
        } else if (remaining === 2) {
          blockSize = Math.random() > 0.5 ? 1 : 2
        } else {
          // Если осталось больше 2 символов, выбираем 1 или 2
          blockSize = Math.random() > 0.5 ? 1 : 2
        }
        
        answerBlocks.push(correctAnswer.slice(i, i + blockSize))
        i += blockSize
      }
    }

    // Перемешиваем блоки (все блоки должны быть использованы)
    const shuffledBlocks = shuffleArray(answerBlocks)
    
    setBlocks(answerBlocks)
    setAvailableBlocks(shuffledBlocks)
    setUserAnswer([])
    setResult(null)
  }, [])

  // Генерируем первый вопрос
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])

  // Добавить блок в ответ
  const addBlock = (block: string, index: number) => {
    setUserAnswer([...userAnswer, block])
    setAvailableBlocks(availableBlocks.filter((_, i) => i !== index))
  }

  // Удалить блок из ответа
  const removeBlock = (index: number) => {
    const block = userAnswer[index]
    setUserAnswer(userAnswer.filter((_, i) => i !== index))
    setAvailableBlocks([...availableBlocks, block])
  }

  // Проверить ответ
  const checkAnswer = () => {
    // Проверяем, что использованы все блоки
    if (availableBlocks.length > 0) {
      return // Не проверяем, пока не использованы все блоки
    }

    const userAnswerStr = userAnswer.join('')
    const correctAnswer = numberToSystem(targetNumber, targetSystem)

    if (userAnswerStr === correctAnswer) {
      setResult('correct')
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setResult('incorrect')
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-lg border border-border bg-card shadow-lg">
        {/* Заголовок */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Блоки с цифрами
            </h1>
            <p className="text-muted-foreground">
              Составь число из блоков в нужной системе
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

        {/* Задание */}
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Десятичное число:
            </p>
            <div className="text-6xl font-bold text-primary">
              {targetNumber}
            </div>
          </div>

          <p className="text-lg font-medium text-foreground">
            Представь это число в {getSystemName(targetSystem)} системе
          </p>

          {/* Область для составления ответа */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Твой ответ:</p>
            <div className="min-h-[80px] p-4 border-2 border-dashed border-primary rounded-md bg-primary/5">
              {userAnswer.length === 0 ? (
                <p className="text-muted-foreground">Перетащи блоки сюда</p>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  {userAnswer.map((block, index) => (
                    <button
                      key={index}
                      onClick={() => removeBlock(index)}
                      className="px-4 py-2 text-xl font-mono font-bold bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-all cursor-pointer"
                    >
                      {block}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Доступные блоки */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Доступные блоки:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableBlocks.map((block, index) => (
                <button
                  key={index}
                  onClick={() => addBlock(block, index)}
                  disabled={result !== null}
                  className="px-4 py-2 text-xl font-mono font-bold bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {block}
                </button>
              ))}
            </div>
          </div>

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
                      Правильный ответ: <span className="font-mono font-bold text-lg">{numberToSystem(targetNumber, targetSystem)}</span>
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
            <div className="space-y-2">
              {availableBlocks.length > 0 && (
                <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
                  Используй все блоки!
                </p>
              )}
              <Button
                onClick={checkAnswer}
                disabled={userAnswer.length === 0 || availableBlocks.length > 0}
                className="w-full"
                size="lg"
              >
                Проверить ответ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

