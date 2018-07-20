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
      stepNumber: 0,
      xIsNext: true,
    };
  }

  getCurrentHistory() {
    const history = this.state.history;
    return history[this.state.stepNumber];
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

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
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  getCurrentPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  } 

  jumpTo(step) {
    debugger
    const history = this.state.history.slice(0, step + 1);

    this.setState({
      history: history,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const currentHistory = this.getCurrentHistory();
    const winner = getWinner(currentHistory.squares);

    const moves = this.state.history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

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
          <ol>{moves}</ol>
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
