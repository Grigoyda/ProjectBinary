import { useState } from 'react'
import { GameSelector } from './components/games/GameSelector'
import { BinaryGuessingGame } from './components/games/BinaryGuessingGame'
import { Game2 } from './components/games/Game2'
import { Game3 } from './components/games/Game3'
import { Game4 } from './components/games/Game4'
import { Game5 } from './components/games/Game5'
import { Game6 } from './components/games/Game6'
import { TestGamesSelector } from './components/games/test/TestGamesSelector'
import type { TestGameId } from './components/games/test/TestGamesSelector'
import { TestGame1 } from './components/games/test/TestGame1'
import { TestGame2 } from './components/games/test/TestGame2'
import { TestGame3 } from './components/games/test/TestGame3'

type GameId = 'binary-guessing' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6' | 'test-games' | null

function App() {
  const [currentGame, setCurrentGame] = useState<GameId>(null)
  const [currentTestGame, setCurrentTestGame] = useState<TestGameId | null>(null)

  const handleSelectGame = (gameId: GameId) => {
    setCurrentGame(gameId)
    setCurrentTestGame(null)
  }

  const handleSelectTestGame = (testGameId: TestGameId) => {
    setCurrentTestGame(testGameId)
  }

  const handleBackToMenu = () => {
    setCurrentGame(null)
    setCurrentTestGame(null)
  }

  const handleBackToTestGames = () => {
    setCurrentTestGame(null)
  }

  // Если выбраны тестовые игры
  if (currentGame === 'test-games') {
    if (currentTestGame === null) {
      return <TestGamesSelector onSelectGame={handleSelectTestGame} onBackToMenu={handleBackToMenu} />
    }

    switch (currentTestGame) {
      case 'test1':
        return <TestGame1 onBackToMenu={handleBackToTestGames} />
      case 'test2':
        return <TestGame2 onBackToMenu={handleBackToTestGames} />
      case 'test3':
        return <TestGame3 onBackToMenu={handleBackToTestGames} />
      default:
        return <TestGamesSelector onSelectGame={handleSelectTestGame} onBackToMenu={handleBackToMenu} />
    }
  }

  if (currentGame === null) {
    return <GameSelector onSelectGame={handleSelectGame} />
  }

  switch (currentGame) {
    case 'binary-guessing':
      return <BinaryGuessingGame onBackToMenu={handleBackToMenu} />
    case 'game2':
      return <Game2 onBackToMenu={handleBackToMenu} />
    case 'game3':
      return <Game3 onBackToMenu={handleBackToMenu} />
    case 'game4':
      return <Game4 onBackToMenu={handleBackToMenu} />
    case 'game5':
      return <Game5 onBackToMenu={handleBackToMenu} />
    case 'game6':
      return <Game6 onBackToMenu={handleBackToMenu} />
    default:
      return <GameSelector onSelectGame={handleSelectGame} />
  }
}

export default App
