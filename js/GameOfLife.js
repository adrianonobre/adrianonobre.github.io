function GameOfLife(size, parentEl, btnStart, btnReset, btnStop) {
	this._size = parseInt(size);
	this._parentEl = parentEl;
	this._table = null;
	
	var gameScope = this;
	btnStart.onclick = function() {gameScope.start.call(gameScope)};
	btnReset.onclick = function() {gameScope.init.call(gameScope)};
	btnStop.onclick = function() {gameScope.stop.call(gameScope)};
	
	this._makeCellAlive = function() {
		this.className = "alive";
	};
	
	this._setStateRunning = function(isRunning) {
		btnStart.disabled = isRunning;
		btnReset.disabled = isRunning;
		btnStop.disabled = !isRunning;
	}
}

GameOfLife.prototype = {
	constructor : GameOfLife,

	init : function() {
		this._setStateRunning(false);
		
		this._clearEl(this._parentEl);

		var div = document.createElement("div");
		this._parentEl.appendChild(div);

		this._table = document.createElement("table");
		div.appendChild(this._table);

		for (var r = 0; r < this._size; r++) {
			var row = document.createElement("tr");
			this._table.appendChild(row);

			for (var c = 0; c < this._size; c++) {
				var cell = document.createElement("td");
				row.appendChild(cell);

				cell.onclick = this._makeCellAlive;
			}
		}
	},

	_clearEl : function(el) {
		while (el.hasChildNodes()) {
			el.removeChild(el.lastChild);
		}
	},
	
	stop : function() {
		this._stopRequested = true;
	},
	
	start : function() {
		this._setStateRunning(true);
		this._stopRequested = false;
		
		var gameScope = this;
		
		var tick = function() {
			var computeNeighbors = function() {
				var counts = new Array(gameScope._size);
				for (var r = 0; r < gameScope._size; r++) {
					counts[r] = new Array(gameScope._size);
	
					for (var c = 0; c < gameScope._size; c++) {
						var nw = isAlive(r - 1, c - 1);
						var n = isAlive(r - 1, c);
						var ne = isAlive(r - 1, c + 1);
						var e = isAlive(r, c + 1);
						var se = isAlive(r + 1, c + 1);
						var s = isAlive(r + 1, c);
						var sw = isAlive(r + 1, c - 1);
						var w = isAlive(r, c - 1);
	
						counts[r][c] = nw + n + ne + e + se + s + sw + w;
					}
				}
	
				return counts;
			};
	
			var isAlive = function(r, c) {
				var result = 0;
	
				var outOfBounds = r < 0 || c < 0 || r >= gameScope._size
						|| c >= gameScope._size;
				if (!outOfBounds) {
					var cell = gameScope._table.rows[r].cells[c];
					if (cell.className === "alive") {
						result = 1;
					} else if (cell.className === "zombie") {
						result = -10;
					} else {
						result = 0;
					}
				}
				return result;
			};
	
			var update = function() {
				var boardChanged = false;
				var counts = computeNeighbors();
				for (var r = 0; r < gameScope._size; r++) {
	
					for (var c = 0; c < gameScope._size; c++) {
						var cell = gameScope._table.rows[r].cells[c];
						var isAlive = cell.className === "alive";
						var isZombie = cell.className === "zombie";
	
						var liveNeighbors = counts[r][c];
						
						if (isAlive) {
							if (liveNeighbors > 5) {
								cell.className= "zombie";
								boardChanged = true;
								
							} else if (liveNeighbors < 2 || liveNeighbors > 3) {
								cell.className= "";
								boardChanged = true;
							}
							
						} else if(isZombie) {
							if (liveNeighbors <= 0) {
								cell.className= "";
								boardChanged = true;
							}
						
						} else {
							if (liveNeighbors == 3) {
								cell.className= "alive";
								boardChanged = true;
							}
						}
					}
				}
				return boardChanged;
			};

			if (!gameScope._stopRequested && update()){
				setTimeout(tick, 1000);
			} else {
				gameScope._setStateRunning(false);
			}
		};
		tick();
	}
}