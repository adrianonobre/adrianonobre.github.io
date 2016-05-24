function GameOfLife(size, parentEl) {
	this._size = parseInt(size);
	this._parentEl = parentEl;
	this._table = null;
	this._stopRequested = { stop: false };
	
	this._makeCellAlive = function() {
		this.className= "alive";
		this.setAttribute("state", "alive");
	};
}

GameOfLife.prototype = {
	constructor : GameOfLife,

	init : function() {
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
		this._stopRequested.stop = true;
	},
	
	start : function() {
		this._stopRequested.stop = false;
		
		var table = this._table;
		var size = this._size;
		var stopRequested = this._stopRequested;
		
		var tick = function() {
			var computeNeighbors = function() {
				var counts = new Array(size);
				for (var r = 0; r < size; r++) {
					counts[r] = new Array(size);
	
					for (var c = 0; c < size; c++) {
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
	
				var outOfBounds = r < 0 || c < 0 || r >= size
						|| c >= size;
				if (!outOfBounds) {
					var cell = table.rows[r].cells[c];
					if (cell.getAttribute("state") === "alive") {
						result = 1;
					} else if (cell.getAttribute("state") === "zombie") {
						result = -10;
					} else {
						result = 0;
					}
				}
				return result;
			};
	
			var refresh = function() {
				var counts = computeNeighbors();
				for (var r = 0; r < size; r++) {
	
					for (var c = 0; c < size; c++) {
						var cell = table.rows[r].cells[c];
						var isAlive = cell.getAttribute("state") === "alive";
						var isZombie = cell.getAttribute("state") === "zombie";
	
						var liveNeighbors = counts[r][c];
						
						if (isAlive) {
							if (liveNeighbors > 5) {
								cell.className= "zombie";
								cell.setAttribute("state", "zombie");
								
							} else if (liveNeighbors < 2 || liveNeighbors > 3) {
								cell.className= "";
								cell.removeAttribute("state");
							}
							
						} else if(isZombie) {
							if (liveNeighbors <= 0) {
								cell.className= "";
								cell.removeAttribute("state");
							}
						
						} else {
							if (liveNeighbors == 3) {
								cell.className= "alive";
								cell.setAttribute("state", "alive");
							}
						}
					}
				}
			};

			refresh();
			if (!stopRequested.stop) {
				setTimeout(tick, 1000);
			}
		};
		tick();
	}
}