import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        // props
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  getCurrentHistory() {
    const history = this.state.history;
    return history[history.length - 1];
  }

  handleClick(i) {
    // Makes a copy.
    const squares = this.getCurrentHistory().squares.slice();

    // Return if Game is over or square in not empty. 
    if (getWinner(squares) || !!squares[i]) {
      return;
    }

    squares[i] = this.getCurrentPlayer();
    
    this.setState({
      // Push the state not modifying the history array.
      history: this.state.history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  getCurrentPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  } 

  render() {
    const currentHistory = this.getCurrentHistory();
    const winner = getWinner(currentHistory.squares);

    let status;

    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.getCurrentPlayer()}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentHistory.squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{ /* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// App init.

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

/** Returns X or O, null if game ended in a draw. */
function getWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; 
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
