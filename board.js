function Board() {
	this.squares = ['', '', '', '', '', '', '', '', ''];
	this.status = 'okay';
}

Board.randomSquare = function () {
	return Math.floor(Math.random() * 9);
}

Board.prototype.set = function (index, playerSymbol) {
	var squares = this.squares;

	if (this.status !== 'okay') {
		throw new Error('Game over man, game over!');
	}

	if (squares[index]) {
		this.status = 'illegal';
	}
	else {
		squares[index] = playerSymbol;

		if (this.hasWinner()) {
			this.status = 'won';
		}
		else if (this.isDraw()) {
			this.status = 'draw';
		}
	}

	return this.status;
};

Board.prototype.hasWinner = function () {
	var squares = this.squares;
	var squares0 = squares[0];
	var squares1 = squares[1];
	var squares2 = squares[2];
	var squares3 = squares[3];
	var squares4 = squares[4];
	var squares5 = squares[5];
	var squares6 = squares[6];
	var squares7 = squares[7];
	var squares8 = squares[8];

	return (
		// rows
		(squares0 && squares0 === squares1  && squares1 === squares2) ||
		(squares3 && squares3 === squares4  && squares4 === squares5) ||
		(squares6 && squares6 === squares7  && squares7 === squares8) ||
		// columns
		(squares0 && squares0 === squares3  && squares3 === squares6) ||
		(squares1 && squares1 === squares4  && squares4 === squares7) ||
		(squares2 && squares2 === squares5  && squares5 === squares8) ||
		// diagonals
		(squares0 && squares0 === squares4  && squares4 === squares8) ||
		(squares2 && squares2 === squares4  && squares4 === squares6) ||
		// no winner
		false
	);
};

Board.prototype.isDraw = function () {
	var squares = this.squares;
	var i;

	for (i = 0; i < 9; ++i) {
		if (!squares[i]) {
			return false;
		}
	}

	return true;
};

// get state of board squares encoded as a single integer (0 - 19683)
Board.prototype.getState = function (playerSymbol) {
	var squares = this.squares;
	var multiplier = 1;
	var state = 0;
	var index;

	for (index = 0; index < 9; ++index) {
		state += squareValue(index) * multiplier;
		multiplier *= 3;
	}

	return state;

	// convert square's character value to an int (0 - 2)
	function squareValue(index) {
		var char = squares[index];

		return char === '' ? 0 : char === playerSymbol ? 1 : 2;
	}
};
