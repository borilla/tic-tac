function Player(parentA, parentB, mutationRate) {
	if (parentA && parentB) {
		this.mergeGenesFrom(parentA, parentB);
		this.applyMutations(mutationRate);
	}
	else {
		this.randomiseGenes();
	}

	this.legalMoves = 0;
	this.illegalMoves = 0;
	this.gamesWon = 0;
	this.gamesLost = 0;
	this.gamesDrawn = 0;
}

// a gene value for each possible board state (9 squares, each with possiblity of 3 states)
Player.countGenes = Math.pow(3, 9);

Player.prototype.play = function (board, playerSymbol) {
	var boardState = board.getState(playerSymbol);
	var square = this.genes[boardState];

	return board.set(square, playerSymbol);
};

Player.prototype.randomiseGenes = function () {
	var length = Player.countGenes;
	var genes = new Array(length);
	var i;

	for (i = 0; i < length; ++i) {
		genes[i] = Board.randomSquare();
	}

	this.genes = genes;
};

Player.prototype.mergeGenesFrom = function (parentA, parentB) {
	var split = Math.floor(Math.random() * Player.countGenes);

	this.genes = parentA.genes.slice(0, split).concat(parentB.genes.slice(split));
};

Player.prototype.applyMutations = function (mutationRate) {
	var genes = this.genes;
	var i, length;

	for (i = 0, length = genes.length; i < length; ++i) {
		if (Math.random() < mutationRate) {
			genes[i] = Board.randomSquare();
			this.mutations++
		}
	}
};
