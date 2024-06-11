import PropTypes from 'prop-types';

function Board({ boardState, onCellClick, lastMoves, winningCells }) {
  return (
    <table className="table-auto ">
      <tbody>
        {boardState.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>
                <button
                  onClick={() => onCellClick(i, j)}
                  className={`w-20 h-20 m-5 border border-gray-600 rounded-lg enabled:hover:bg-gray-500 transition-all text-3xl font-bold
                   ${lastMoves.includes([i, j].toString()) && '!border-red-600 !border-4'} disabled:cursor-not-allowed
                    ${winningCells?.includes([i, j].toString()) && 'bg-green-400'}
                  `}
                  disabled={cell !== null || winningCells}
                >
                  {cell}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Board.propTypes = {
  boardState: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  onCellClick: PropTypes.func.isRequired,
  lastMoves: PropTypes.array.isRequired,
  winningCells: PropTypes.array,
};

export default Board;
