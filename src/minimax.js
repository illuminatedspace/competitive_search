/*
 0 0 0 0 0
 0 0 0 0 0
 0 0 0 0 0
 0 0 0 0 0
 0 0 x 0 0
 */
/*
 0 0 0 0 0
 0 0 0 0 0
 0 0 0 0 0
 0 0 0 0 0
 0 o x 0 0
 */

/*
 *
 *
 The function "makeMove" is already written for you.
 You do not need to modify it, but you should read it.

 It will choose moves intelligently once minimax,
 which it invokes, evaluates different board-states
 intelligently.  It is the only function invoked when
 you play against the computer after starting up
 the server.

 Input: A state object, representing the Connect 4 board.

 Output: Returns an integer indicating the column
 where the piece will be dropped.

 This is the only function called when
 you are playing against your agent.

 */

const makeMove = function(state){

  //Find whose move it is; 'x' or 'o'
  var playerMoving = state.nextMovePlayer;

  // state.legalMoves returns an array of integer values,
  // which indicate the locations (0 through 6)
  // where one can currently legally drop a piece.
  var allLegalMoves = state.legalMoves();

  // To get a successor state following a move,
  // just call state.move(someMove).  This returns
  // the board state after that move has been made.
  // It autmatically switches the player whose
  // move it is, and so on and so forth
  //
  // Note that state is immutable; invoking state.move
  // does NOT change the original state, but
  // returns a new one.
  var newState = state.move(allLegalMoves[0]);


  // The following is the guts of the make-move function.
  // The function max(arr, func) returns the element
  // from the array "arr" which has the greatest value
  // according to the function "func"
  var depth = 3
  return max(allLegalMoves, function(move){
    var potentialState = state.move(move)
    // In the below, the current player has been chosen as the
    // maximizing player and passed into the minimax function.
    //
    // IMPORTANT: The maximizing player is the only variable passed on unchanged
    // when the minimax function invokes itself recursively.  This is
    // a common point of confusion.
    //
    return minimax(potentialState, depth, playerMoving)
    //return minimaxAlphaBetaWrapper(potentialState, depth, playerMoving)
  });

}

/*Max: Ancillary function.

 Max returns the value from "arr" which is greatest
 as evaluated by "func".

 So for instance, if you passed
 it [1,2,3,-4,-5], and (x) => Math.abs(x), it would return
 -5, because -5 is the greatest element as evaluated by "func".

 Similarly, if you passed it ["as","xxxxx","dns"] and
 (x) => x.length, it would return "xxxxx"

 */
var max = function(arr, func){
  return arr.reduce(function(tuple, cur, index){
    var value = func(cur)
    return (tuple.value >= value) ? tuple : {element: cur, value: value};
  },{element: arr[0], value: func(arr[0])}).element;
}

/*
 The function "heuristic" is one you must (mostly)
 write.

 Input: state, maximizingPlayer.  The state will be
 a state object.  The maximizingPlayer will be either
 an 'x' or an 'o', and is the player whose advantage
 is signified by positive numbers.

 Output: A number evaluating how good the state is from
 the perspective of the player who is maximizing.

 A useful method on state here would be state.numLines.
 This function takes an integer and a player
 like this "state.numLines(2,'x')" and returns the
 number of lines of that length which that player
 has.  That is, it returns the number of contiguous linear
 pieces of that length that that player has.

 This is useful because, generally speaking, it is better
 to have lots of lines that fewer lines, and much better
 to have longer lines than shorter lines.

 You'll want to pass the tests defined in minimax_specs.js.
 */

/*
 Returns 'x' when coords map to an x
 Returns 'o' when coords map to an o
 Returns 0 when coords map to an 0
 Returns undefined when coords are off the board
 */
function getLocation(state, x, y) {
  return state.board[x] && state.board[x][y];
}

function isValid(state, x, y) {
  var below = getLocation(state, x + 1, y);
  return getLocation(state, x, y) === 0 && (below !== 0 || below === undefined)
}

function getOpenOnes(state, player) {
  let count = 0;

  for (let x = state.board.length - 1; x >= 0; x--) {
    for (let y = state.board[x].length - 1; y >= 0; y--) {
      if (getLocation(state, x, y) === player) {
        // Left + right
        if (isValid(state, x, y - 1) && getLocation(state, x, y + 1) !== player) {
          count++;
        }
        if (getLocation(state, x, y + 1) !== player && isValid(state, x, y - 1)) {
          count++;
        }

        // Up + Down
        if (isValid(state, x + 1, y) && getLocation(state, x - 1, y) !== player) {
          count++;
        }
        if (getLocation(state, x + 1, y) !== player && isValid(state, x - 1, y)) {
          count++;
        }

        // Diagonal
        if (isValid(state, x + 1, y + 1) && getLocation(state, x - 1, y - 1) !== player) {
          count++;
        }
        if (getLocation(state, x + 1, y + 1) !== player && isValid(state, x - 1, y - 1)) {
          count++;
        }
        if (isValid(state, x + 1, y - 1) && getLocation(state, x - 1, y + 1) !== player) {
          count++;
        }
        if (getLocation(state, x + 1, y - 1) !== player && isValid(state, x - 1, y + 1)) {
          count++;
        }
      }
    }
  }

  return count;
}

function getOpenTwos(state, player) {
  let count = 0;

  for (let x = state.board.length - 1; x >= 0; x--) {
    for (let y = state.board[x].length - 1; y >= 0; y--) {
      if (getLocation(state, x, y) === player) {
        // Left + right
        if (
          isValid(state, x, y - 1) &&
          getLocation(state, x, y + 1) === player &&
          getLocation(state, x, y + 2) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x, y - 1) !== player &&
          getLocation(state, x, y + 1) === player &&
          isValid(state, x, y + 2)
        ) {
          count++;
        }

        // Up + Down
        if (
          isValid(state, x + 2, y) &&
          getLocation(state, x + 1, y) === player &&
          getLocation(state, x - 1, y) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 2, y) !== player &&
          getLocation(state, x + 1, y) === player &&
          isValid(state, x - 1, y)
        ) {
          count++;
        }

        // Diagonal
        if (
          isValid(state, x + 2, y + 2) &&
          getLocation(state, x + 1, y + 1) === player &&
          getLocation(state, x - 1, y - 1) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 2, y + 2) !== player &&
          getLocation(state, x + 1, y + 1) === player &&
          isValid(state, x - 1, y - 1)
        ) {
          count++;
        }
        if (
          isValid(state, x + 2, y - 2) &&
          getLocation(state, x + 1, y - 1) === player &&
          getLocation(state, x - 1, y + 1) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 2, y - 2) !== player &&
          getLocation(state, x + 1, y - 1) === player &&
          isValid(state, x - 1, y + 1)
        ) {
          count++;
        }
      }
    }
  }

  return count;
}

function getOpenThrees(state, player) {
  let count = 0;

  for (let x = state.board.length - 1; x >= 0; x--) {
    for (let y = state.board[x].length - 1; y >= 0; y--) {
      if (getLocation(state, x, y) === player) {
        // Left + right
        if (
          isValid(state, x, y - 1) &&
          getLocation(state, x, y + 1) === player &&
          getLocation(state, x, y + 2) === player &&
          getLocation(state, x, y + 3) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x, y - 1) !== player &&
          getLocation(state, x, y + 1) === player &&
          getLocation(state, x, y + 2) === player &&
          isValid(state, x, y + 3)
        ) {
          count++;
        }

        // Up + Down
        if (
          isValid(state, x + 3, y) &&
          getLocation(state, x + 2, y) === player &&
          getLocation(state, x + 1, y) === player &&
          getLocation(state, x - 1, y) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 3, y) !== player &&
          getLocation(state, x + 2, y) === player &&
          getLocation(state, x + 1, y) === player &&
          isValid(state, x - 1, y)
        ) {
          count++;
        }

        // Diagonal
        if (
          isValid(state, x + 3, y + 3) &&
          getLocation(state, x + 2, y + 2) === player &&
          getLocation(state, x + 1, y + 1) === player &&
          getLocation(state, x - 1, y - 1) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 3, y + 3) !== player &&
          getLocation(state, x + 2, y + 2) === player &&
          getLocation(state, x + 1, y + 1) === player &&
          isValid(state, x - 1, y - 1)
        ) {
          count++;
        }
        if (
          isValid(state, x + 3, y - 3) &&
          getLocation(state, x + 2, y - 2) === player &&
          getLocation(state, x + 1, y - 1) === player &&
          getLocation(state, x - 1, y + 1) !== player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 3, y - 3) !== player &&
          getLocation(state, x + 2, y - 2) === player &&
          getLocation(state, x + 1, y - 1) === player &&
          isValid(state, x - 1, y + 1)
        ) {
          count++;
        }
      }
    }
  }

  return count;
}

function getFours(state, player) {
  let count = 0;

  for (let x = state.board.length - 1; x >= 0; x--) {
    for (let y = state.board[x].length - 1; y >= 0; y--) {
      if (getLocation(state, x, y) === player) {
        // Left + right
        if (
          getLocation(state, x, y + 1) === player &&
          getLocation(state, x, y + 2) === player &&
          getLocation(state, x, y + 3) === player
        ) {
          count++;
        }
        if (
          getLocation(state, x, y - 1) === player &&
          getLocation(state, x, y + 1) === player &&
          getLocation(state, x, y + 2) === player
        ) {
          count++;
        }

        // Up + Down
        if (
          getLocation(state, x + 2, y) === player &&
          getLocation(state, x + 1, y) === player &&
          getLocation(state, x - 1, y) === player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 3, y) === player &&
          getLocation(state, x + 2, y) === player &&
          getLocation(state, x + 1, y) === player
        ) {
          count++;
        }

        // Diagonal
        if (
          getLocation(state, x + 2, y + 2) === player &&
          getLocation(state, x + 1, y + 1) === player &&
          getLocation(state, x - 1, y - 1) === player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 3, y + 3) === player &&
          getLocation(state, x + 2, y + 2) === player &&
          getLocation(state, x + 1, y + 1) === player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 2, y - 2) === player &&
          getLocation(state, x + 1, y - 1) === player &&
          getLocation(state, x - 1, y + 1) === player
        ) {
          count++;
        }
        if (
          getLocation(state, x + 3, y - 3) === player &&
          getLocation(state, x + 2, y - 2) === player &&
          getLocation(state, x + 1, y - 1) === player
        ) {
          count++;
        }
      }
    }
  }

  return count;
}

var heuristic = function(state, maximizingPlayer){

  //This is how you can retrieve the minimizing player.
  var minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';

  //An example.
  var linesOfLengthTwoForX = state.numLines(2, 'x');

  if(getFours(state, 'x')) {
    return (maximizingPlayer === 'x' ? 1: -1) * (Number.MAX_SAFE_INTEGER - 1)
  }
  if(getFours(state, 'o')) {
    return (maximizingPlayer === 'o' ? 1: -1) * (Number.MAX_SAFE_INTEGER - 1)
  }

  var xData = {
    openOnes: getOpenOnes(state, 'x'),
    openTwos: getOpenTwos(state, 'x'),
    openThrees: getOpenThrees(state, 'x')
  };

  var oData = {
    openOnes: getOpenOnes(state, 'o'),
    openTwos: getOpenTwos(state, 'o'),
    openThrees: getOpenThrees(state, 'o')
  };

  //Your code here.  Don't return random, obviously.
  var maxPlayer = xData;
  var minPlayer = oData;

  if(maximizingPlayer === 'o') {
    maxPlayer = oData;
    minPlayer = xData;
  }

  let results = (maxPlayer.openOnes + maxPlayer.openTwos * 2 + maxPlayer.openThrees * 3) - (minPlayer.openOnes + minPlayer.openTwos * 2 + minPlayer.openThrees * 3);
  console.log(state.legalMoves());
  console.log(
    'x:',
    xData,
    'o:',
    oData,
    results,
    state.board.map(row => row.join(' ')).join('\n')
  );

  return results;
}



/*
 The function "minimax" is one you must write.

 Input: state, depth, maximizingPlayer.  The state is
 an instance of a state object.  The depth is an integer
 greater than zero; when it is zero, the minimax function
 should return the value of the heuristic function.

 Output: Returns a number evaluating the state, just
 like heuristic does.

 You'll need to use state.nextStates(), which returns
 a list of possible successor states to the state passed in
 as an argument.

 You'll also probably need to use state.nextMovePlayer,
 which returns whether the next moving player is 'x' or 'o',
 to see if you are maximizing or minimizing.
 */
var minimax = function(state, depth, maximizingPlayer){
  var minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';
  var possibleStates = state.nextStates();
  var currentPlayer = state.nextMovePlayer;

  if (depth === 0) {
    return heuristic(state, maximizingPlayer);
  } else {
    let stateVals = possibleStates.map(function(possibleState) {
      return minimax(possibleState, depth - 1, maximizingPlayer);
    });
    if (currentPlayer === maximizingPlayer) {
      return Math.max(stateVals);
    } else {
      return Math.min(stateVals);
    }
  }
}



/* minimaxAlphaBetaWrapper is a pre-written function, but it will not work
 unless you fill in minimaxAB within it.

 It is called with the same values with which minimax itself is called.*/
var minimaxAlphaBetaWrapper = function(state, depth, maximizingPlayer){

  /*
   You will need to write minimaxAB for the extra credit.
   Input: state and depth are as they are before.  (Maximizing player
   is closed over from the parent function.)

   Alpha is the BEST value currently guaranteed to the maximizing
   player, if they play well, no matter what the minimizing player
   does; this is why it is a very low number to start with.

   Beta is the BEST value currently guaranteed to the minimizing
   player, if they play well, no matter what the maximizing player
   does; this is why it is a very high value to start with.
   */
  var minimaxAB = function(state, depth, alpha, beta){
  }

  return minimaxAB(state, depth, -100000,100000)
}

//ecxport default {makeMove, minimax, heuristic};
module.exports = {makeMove, minimax, heuristic};
