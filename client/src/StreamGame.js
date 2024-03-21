import React, { useEffect, useState } from 'react'
import ndjson from 'ndjson'
import hyperquest from 'hyperquest'

const findLastBotMove = (moves, color) => {
  for (let i = moves.length - 1; i >= 0; i--) {
    if (color === 'white' && i % 2 === 0) {
      return moves[i]
    } else if (color === 'black' && i % 2 !== 0) {
      return moves[i]
    }
  }

  return null
}

export const StreamGame = ({ gameId, setIsUsersTurn, magnet }) => {
  const [botColor, setBotColor] = useState('')
  const [lastBotMove, setLastBotMove] = useState('N/A')
  const [winner, setWinner] = useState('N/A')
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    hyperquest(`http://localhost:5000/game_state/${gameId}`)
      .pipe(ndjson.parse())
      .on('data', (data) => {
        if (data.type === 'gameFull') {
          if ('aiLevel' in data.white) {
            setBotColor('white')
          } else {
            setBotColor('black')
          }

          if (botColor === 'white') {
            setLastBotMove(data.state.moves)
            magnet.makeMove(data.state.moves)
            setIsUsersTurn(data.state.moves)
          } else {
            setIsUsersTurn(true)
          }
        }

        if (data.type === 'gameState') {
          const movesRaw = data.moves
          const moves = movesRaw === '' ? [] : movesRaw.split(' ')
          setLastBotMove(findLastBotMove(moves, botColor))
          magnet.makeMove(findLastBotMove(moves, botColor))
          const isBotTurn =
            (botColor === 'white' && moves.length % 2 === 0) ||
            (botColor === 'black' && moves.length % 2 !== 0)
          setIsUsersTurn(!isBotTurn)
          setStatus(data.status)
          setWinner(data?.winner || 'N/A')
        }
      })
  }, [botColor, gameId, magnet, setIsUsersTurn])

  return (
    <div>
      <h2>Game ID: {gameId}</h2>
      <p>Last bot move: {lastBotMove}</p>
      <p>Status: {status}</p>
      <p>Winner: {winner}</p>
    </div>
  )
}
