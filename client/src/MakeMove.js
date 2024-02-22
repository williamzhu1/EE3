import { useState } from 'react'
import axios from 'axios'

export const MakeMove = ({ gameId, isUsersTurn }) => {
  const [move, setMove] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setMove(e.target.value)
  }

  const submitMove = () => {
    axios
      .post(
        `http://localhost:5000/make_move/${gameId}`,
        { move },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(() => {
        setMove('')
        setError('')
      })
      .catch((err) => {
        console.error(err)
        setError('Invalid move')
      })
  }

  return (
    <div>
      <input
        type="text"
        value={move}
        onChange={handleInputChange}
        placeholder="e.g., e2e4"
        disabled={!isUsersTurn}
      />
      <button onClick={submitMove} disabled={!isUsersTurn || !move}>
        Submit Move
      </button>
      <p>{error}</p>
    </div>
  )
}
