import { useState } from 'react'
import { CreateGame } from './CreateGame'
import { StreamGame } from './StreamGame'
import { MakeMove } from './MakeMove'

export const App = () => {
  const [gameId, setGameId] = useState('')
  const [isUsersTurn, setIsUsersTurn] = useState(false)

  return (
    <>
      {!gameId && <CreateGame setGameId={setGameId} />}
      {gameId && <StreamGame setIsUsersTurn={setIsUsersTurn} gameId={gameId} />}
      {gameId && <MakeMove gameId={gameId} isUsersTurn={isUsersTurn} />}
    </>
  )
}
