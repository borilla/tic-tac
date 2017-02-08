function BoardRenderer() {
	this.boardEl = document.getElementById('board');
	this.squareEls = document.querySelectorAll('.square');
}

BoardRenderer.prototype.render = function (board) {
	var boardEl = this.boardEl;
	var squareEls = this.squareEls;

	return new Promise(function (resolve) {
		var i, l;

		boardEl.className = board.state;
		for (i = 0, l = squareEls.length; i < l; ++i) {
			squareEls[i].innerHTML = board.squares[i] || '&nbsp;';
		}

		requestAnimationFrame(resolve);
	});
}
