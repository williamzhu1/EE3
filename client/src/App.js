import { useState } from 'react'
import { CreateGame } from './CreateGame'
import { StreamGame } from './StreamGame'
import { MakeMove } from './MakeMove'
import { BluetoothButton } from './BluetoothButton'
import { Magnet } from './utils/Magnet';

export const App = () => {
  const [gameId, setGameId] = useState('')
  const [isUsersTurn, setIsUsersTurn] = useState(false)
  const [magnet] = useState(new Magnet())

  return (
    <>
      {!gameId && <CreateGame setGameId={setGameId} />}
      {gameId && <StreamGame setIsUsersTurn={setIsUsersTurn} gameId={gameId} magnet={magnet} />}
      {gameId && <MakeMove gameId={gameId} isUsersTurn={isUsersTurn} />}
      <BluetoothButton magnet={magnet} />
    </>
  )
}
