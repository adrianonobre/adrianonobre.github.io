function LogoUnary(cols, rows, anchor, commands) {
    this._cols = cols;
    this._rows = rows;
    this._anchor = anchor;
    this._char = "X";
    this._commandsBoard = commands;
    this._interval = 100;
}

LogoUnary.prototype = {
    constructor: LogoUnary,
    
    start : function() {
        this._col = 0;
        this._row = 0;        
        this._table = this._drawTable(this._cols, this._rows, this._anchor);
        this._loadCommands();
        this._table.rows[this._row].cells[this._col].className = "turtle-up";
        this._actionQueue = [];
    },
    
    setInterval : function(interval) {
        this._interval = interval;
    },
    
    executeCommands : function() {
        var that = this;
        var commands = this._commandsBoard.value.split("\n");
        var nextCommand = commands.shift();
        if (nextCommand) {
            this._commandsBoard.value = commands.join("\n");
            var nextCommand = nextCommand.split(" ");
            var command = nextCommand[0];
            var argument = nextCommand[1];
            if (command && argument) {
                this._commands[command](argument);
            }
        }
    },
    
    normalTurtle: function() {
        this._interval = 100;
    },
    
    fastTurtle: function() {
        this._interval = 10;
    },
    
    _drawTable : function(cols, rows, anchor) {
        while (anchor.firstChild) {
            anchor.removeChild(anchor.firstChild);
        }
    
        var table = document.createElement("table");
        table.className = "main-board";
        
        var r, c;
        for (r = 0; r < rows; r++) {
            var row = document.createElement("tr");
			table.appendChild(row);

			for (var c = 0; c < cols; c++) {
				var cell = document.createElement("td");
				row.appendChild(cell);
			}
		}
        
        anchor.appendChild(table);
        return table;       
    },
    
    _loadCommands: function() {
        var t = this;
        this._commands = {}
        this._commands["GOTOX"] = function(arg) { arg = Number(arg);
                                                  var times = Math.abs(t._col - arg);
                                                  var moveOne = t._col < arg ? t._right : t._left;
                                                  t._executeAction(moveOne, times, t); }
                                                  
        this._commands["GOTOY"] = function(arg) { arg = Number(arg);
                                                  var times = Math.abs(t._row - arg);
                                                  var moveOne = t._row < arg ? t._down : t._up;
                                                  t._executeAction(moveOne, times, t); }
                                                  
        this._commands["UP"] = function(arg) { var times = Number(arg);
                                               t._executeAction(function() { t._print(t); t._up(t); }, times, t); }
                                               
        this._commands["DOWN"] = function(arg) { var times = Number(arg);
                                                 t._executeAction(function() { t._print(t); t._down(t); }, times, t); }
                                                 
        this._commands["LEFT"] = function(arg) { var times = Number(arg);
                                                 t._executeAction(function() { t._print(t); t._left(t); }, times, t); }
                                                 
        this._commands["RIGHT"] = function(arg) { var times = Number(arg);
                                                  t._executeAction(function() { t._print(t); t._right(t); }, times, t); }
                                                  
        this._commands["CHAR"] = function(arg) { t._executeAction(function() { t._char = arg; }, 1, t); }
    
    },
    
    _executeAction : function(action, times, t) {
        var executeActionOrProcessNextCommand = function() {
            if (times > 0) {
                action(t);
                times--;
                setTimeout(executeActionOrProcessNextCommand, t._interval);
            } else {
                t.executeCommands();
            }
        }
        executeActionOrProcessNextCommand();
    },
    
    // *********************************************************************
    // actions that can be used to compose commands
    _print : function(t) {
        t._table.rows[t._row].cells[t._col].innerHTML = t._char;
    },
    
    _right : function(t) {
        if (t._col + 1 < t._cols) {
            t._table.rows[t._row].cells[t._col].className = "";
            t._col++;
            t._table.rows[t._row].cells[t._col].className = "turtle-right";
        }
    },
    
    _left : function(t) {
        if (t._col - 1 >= 0) {
            t._table.rows[t._row].cells[t._col].className = "";
            t._col--;
            t._table.rows[t._row].cells[t._col].className = "turtle-left";
        }
    },
    
    _up : function(t) {
        if (t._row - 1 >= 0) {
            t._table.rows[t._row].cells[t._col].className = "";
            t._row--;
            t._table.rows[t._row].cells[t._col].className = "turtle-up";
        }
    },
    
    _down : function(t) {
        if (t._row + 1 < t._rows) {
            t._table.rows[t._row].cells[t._col].className = "";
            t._row++;
            t._table.rows[t._row].cells[t._col].className = "turtle-down";
        }
    },
    // *********************************************************************
    
    drawingToProgram : function(transferPad) {
    // midnight hack... this would have been nice to write as a state machine
        var commands = [];
        
        var lines = transferPad.value.split("\n");
        var row;
        
        for (row = 0; row < lines.length && row < this._rows; row++) {
            commands.push("GOTOY " + row);
            var col;

            var moves = 0;
            var curr_char = " ";
            for (col = 0; col < lines[row].length && col < this._cols; col++) {
                var char = lines[row][col];
                if (char != curr_char) {
                    if (curr_char == " ") {
                        commands.push("GOTOX " + col);
                        commands.push("CHAR " + char);
                    } else {
                        if (moves > 0) {
                            commands.push("RIGHT " + moves);
                        }
                        if (char != " ") { 
                            commands.push("CHAR " + char);
                        }
                    }
                    moves = 1;
                    curr_char = char;
                } else {
                    moves++;
                }
            }
            if (moves > 0 && curr_char != " ") {
                commands.push("RIGHT " + moves);
            }                                
        }
        this._commandsBoard.value = commands.join("\n");
    }
}