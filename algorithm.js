var populationSize = 100;
var population;
var iteration = 0;
var maxIterations = 200;
var renderer = new BoardRenderer();
var mutationRate = 0.01;

function doIteration(population) {
	playTournament(population).then(function () {
		logIterationInfo(population);

		if (++iteration < maxIterations) {
			doIteration(getNextgeneration(population));
		}
	});
}

function logIterationInfo(population) {
	var populationSize = population.length;
	var totalLegalMoves = 0;
	var totalIllegalMoves = 0;
	var totalGamesWon = 0;
	var totalGamesLost = 0;
	var totalGamesDrawn = 0;
	var averageLegalMoves, averageIllegalMoves, averageGamesWon;
	var averageGamesLost, averageGamesDrawn, i, player;

	for (i = 0; i < populationSize; ++i) {
		player = population[i];
		totalLegalMoves += player.legalMoves;
		totalIllegalMoves += player.illegalMoves;
		totalGamesWon += player.gamesWon;
		totalGamesLost += player.gamesLost;
		totalGamesDrawn += player.gamesDrawn;
	}

	averageLegalMoves = Math.round(totalLegalMoves / populationSize);
	averageIllegalMoves = Math.round(totalIllegalMoves / populationSize);
	averageGamesWon = Math.round(totalGamesWon / populationSize);
	averageGamesLost = Math.round(totalGamesLost / populationSize);
	averageGamesDrawn = Math.round(totalGamesDrawn / populationSize);

	console.log('iteration', iteration, 'averageLegalMoves', averageLegalMoves);
}

function playTournament(population) {
	return new Promise(function (resolve) {
		var i = 0;
		var j = 0;
		var l = population.length;

		playNextGame();

		function playNextGame() {
			var board = playGame(population[i], population[j]);
			var promise = i === 0 && j === 0 ? renderer.render(board) : Promise.resolve();

			promise.then(function () {
				if (++j === l) {
					j = 0;
					++i;
				}

				if (i < l) {
					playNextGame();
				}
				else {
					resolve();
				}
			});
		}
	});
}

function playGame(player1, player2) {
	var board = new Board();
	var currentPlayer = player1;
	var nextPlayer = player2;
	var currentSymbol = 'X';
	var nextSymbol = 'O';
	var tmp;

	while (board.status === 'okay') {
		// play a move
		currentPlayer.play(board, currentSymbol);

		// add scores
		switch (board.status) {
			case 'okay':
				currentPlayer.legalMoves++;
				break;
			case 'won':
				currentPlayer.legalMoves++;
				currentPlayer.gamesWon++;
				nextPlayer.gamesLost++;
				break;
			case 'draw':
				currentPlayer.legalMoves++;
				currentPlayer.gamesDrawn++;
				nextPlayer.gamesDrawn++;
				break;
			case 'illegal':
				currentPlayer.illegalMoves++;
				break;
		}

		// switch players
		tmp = currentPlayer;
		currentPlayer = nextPlayer;
		nextPlayer = tmp;

		// switch symbols
		tmp = currentSymbol;
		currentSymbol = nextSymbol;
		nextSymbol = tmp;
	}

	return board;
}

function createNewRandomPopulation() {
	var i, population;

	population = new Array(populationSize);
	for (i = 0; i < populationSize; ++i) {
		population[i] = new Player();
	}

	return population;
}

function getNextgeneration(currentPopulation) {
	var populationSize = currentPopulation.length;
	var newPopulation = new Array(populationSize);
	var i, parentA, parentB;

	currentPopulation.sort(comparePlayers);

	for (i = 0; i < populationSize; ++i) {
		parentA = chooseRandomParent(currentPopulation);
		parentB = chooseRandomParent(currentPopulation);
		newPopulation[i] = new Player(parentA, parentB, mutationRate);
	}

	return newPopulation;
}

function comparePlayers(playerA, playerB) {
	var scoreA = calcScore(playerA);
	var scoreB = calcScore(playerB);

	return scoreA > scoreB ? -1 : scoreB > scoreA ? 1 : 0;
}

function calcScore(player) {
	return player.legalMoves + 10 * player.gamesWon - 10 * player.gamesLost + 5 * player.gamesDrawn;
}

function chooseRandomParent(population) {
	// choose index according to (roughly) inverse cube weighting
	var r = Math.pow(Math.random(), 0.3);
	var i = Math.floor((1 - r) * population.length);

	return population[i];
}

doIteration(createNewRandomPopulation());
