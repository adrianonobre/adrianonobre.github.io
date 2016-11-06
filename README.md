The goal of this is to implement a program that, given a set of commands that are solely unary operators, design a program that will output ASCII art to an 80x25 console screen. The language will be Turtle Logo-like but will only use unary operators.
 
The screen coordinates will be defined by the upper left-hand corner of the screen (0, 0) and end in the lower-right hand corner (79, 24). The current draw character will start with a capital X character.
 
At a minimum your program should support:
GOTOX n - sets the cursor to current y position and the new x position
GOTOY n - sets the cursor to the current x position and the new y position
UP n - begins drawing at the current (x,y) coordinate, moves the cursor up n places, drawing behind it (it will not draw anything in the ending position of the cursor)
DOWN n - begins drawing at the current (x,y) coordinate, moves the cursor down n places, drawing behind it (it will not draw anything in the ending position of the cursor)
LEFT n - begins drawing at the current (x,y) coordinate, moves the cursor left n places, drawing behind it (it will not draw anything in the ending position of the cursor)
RIGHT n - begins drawing at the current (x,y) coordinate, moves the cursor right n places, drawing behind it (it will not draw anything in the ending position of the cursor)
CHAR c - changes the current cursor to c.
 
The twist? Add one (or more) unary operators to make your program unique.
All submissions should include a sample "Unary Logo" program (and instructions on how to run) demonstrating some ASCII art that can be made with your program.
