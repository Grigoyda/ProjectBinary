import { useState } from 'react'
import { GameSelector } from './components/games/GameSelector'
import { BinaryGuessingGame } from './components/games/BinaryGuessingGame'
import { Game2 } from './components/games/Game2'
import { Game3 } from './components/games/Game3'
import { Game4 } from './components/games/Game4'
import { Game5 } from './components/games/Game5'
import { Game6 } from './components/games/Game6'

type GameId = 'binary-guessing' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6' | null

function App() {
  const [currentGame, setCurrentGame] = useState<GameId>(null)
  const [currentTestGame, setCurrentTestGame] = useState<null>(null)

  const handleSelectGame = (gameId: GameId) => {
    setCurrentGame(gameId)
  }

  const handleBackToMenu = () => {
    setCurrentGame(null)
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
