import { useEffect, useState } from 'react';
import Board from './Board';

const BOARD_SIZE = 3;

export default function Game() {
  const [board, setBoard] = useState([]);
  const [startingPlayer, setStartingPlayer] = useState('X');
  const [currentPlayer, setCurrentPlayer] = useState();
  const [lastMoves, setLastMoves] = useState({ X: [], O: [] });
  const [winner, setWinner] = useState(null);
  const [scoreTally, setScoreTally] = useState({ X: 0, O: 0 });

  const initializeBoard = () => {
    let newBoard = [];
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => {
        newBoard.push(Array(BOARD_SIZE).fill(null));
      });
    setBoard(newBoard);
  };

  useEffect(() => {
    setCurrentPlayer(startingPlayer);
  }, [startingPlayer]);
  useEffect(() => {
    initializeBoard();
  }, []);

  const onCellClick = (i, j) => {
    if (board[i][j]) return console.error('Cell is already filled');

    setBoard((prevBoard) => {
      let newBoard = prevBoard.map((row) => [...row]);
      newBoard[i][j] = currentPlayer;
      let newLastMoves = [...lastMoves[currentPlayer]];
      if (newLastMoves.length === 3) {
        const [moveX, moveY] = newLastMoves.shift();
        newBoard[moveX][moveY] = null;
      }
      newLastMoves.push([i, j]);
      setLastMoves({ ...lastMoves, [currentPlayer]: newLastMoves });
      const winningCells = checkWin(newBoard);
      if (winningCells) {
        setWinner({ cells: winningCells, player: currentPlayer });
      }
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      return newBoard;
    });
  };

  useEffect(() => {
    if (winner?.player) {
      setScoreTally((prevScore) => {
        return {
          ...prevScore,
          [winner.player]: prevScore[winner.player] + 1,
        };
      });
    }
  }, [winner]);

  const checkWin = (board) => {
    // Check rows
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (board[row].every((cell) => cell === board[row][0] && cell !== null)) {
        return board[row].map((_, colIndex) => [row, colIndex]);
      }
    }

    // Check columns
    for (let col = 0; col < BOARD_SIZE; col++) {
      let column = board.map((row) => row[col]);
      if (column.every((cell) => cell === column[0] && cell !== null)) {
        return column.map((_, rowIndex) => [rowIndex, col]);
      }
    }

    // Check diagonals
    let diag1 = [];
    let diag2 = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      diag1.push(board[i][i]);
      diag2.push(board[i][BOARD_SIZE - i - 1]);
    }
    if (diag1.every((cell) => cell === diag1[0] && cell !== null)) {
      return diag1.map((_, index) => [index, index]);
    }
    if (diag2.every((cell) => cell === diag2[0] && cell !== null)) {
      return diag2.map((_, index) => [index, BOARD_SIZE - index - 1]);
    }

    return null;
  };

  const restart = () => {
    initializeBoard();
    setWinner(null);
    setLastMoves({ X: [], O: [] });
    setStartingPlayer(startingPlayer === 'X' ? 'O' : 'X');
  };

  return (
    <div>
      <h1 className="text-5xl font-bold mb-3">
        Rotational
        <br />
        Tic Tac Toe
      </h1>
      <div>
        <div className="text-3xl font-bold mt-10">Score</div>
        <div className="flex justify-between">
          <div className="text-2xl font-bold">
            Player X: <span className="text-green-600">{scoreTally.X}</span>
          </div>
          <div className="text-2xl font-bold">
            Player O: <span className="text-green-600">{scoreTally.O}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-20">
        <div>
          <p className="text-lg">
            <strong>{currentPlayer}</strong> Turn
          </p>
          <Board
            boardState={board}
            onCellClick={onCellClick}
            lastMoves={[
              lastMoves.X.length >= 3 && lastMoves.X?.[0]?.toString(),
              lastMoves.O.length >= 3 && lastMoves.O?.[0]?.toString(),
            ]}
            winningCells={winner?.cells.map((cell) => cell.toString())}
          />
        </div>
      </div>

      {winner && (
        <div>
          <div className="text-3xl font-bold mt-10 mb-5">{winner.player} wins!</div>
          <button
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  shadow-lg shadow-green-500/50  font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2"
            onClick={restart}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}
