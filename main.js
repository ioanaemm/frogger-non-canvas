$(document).ready(initGame);

function initGame() {
  var playerTileX = 0;
  var playerTileY = 0;
  var initialPlayerTileX = 2;
  var initialPlayerTileY = 5;
  var tileWidth = 101;
  var tileHeight = 83;
  var tileImageHeight = 171;
  var boardWidth = 8;
  var boardHeight = 6;
  var score = 0;
  var totalScore = 0;
  var updateBugsInterval;
  var game = $('#game');


  var rows = [
    "water", "stone", "stone", "stone", "grass", "grass"
  ];

  var players = [
    'images/char-boy.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
  ];
  var playerIndex = 0;

  var crtLevel = 0;
  var gateX = Math.round(Math.random() * 4);
  var numberOfLives = 3;

  $(window).keydown(onKeyDown);
  function onKeyDown(event) {
    switch(event.which) {
      case 40:
        move(0,1);
        break;
      case 38:
        move(0,-1);
        break;
      case 37:
        move(-1,0);
        break;
      case 39:
        move(1,0);
        break;
    }
  }

  function startGame() {
    $(".game_lost").hide();
    $("#begin_game_screen").hide();
    crtLevel = 0;
    numberOfLives = 3;
    drawTiles();
    startLevel();
    drawLives();
  }


// you should have an event handler for the arrow buttons
//and that handler should change the source of the image
//based on the current index in the array;
//there should only be one append, in the beginning;
// and then on each click, navigate through the array by one element in either direction;
// then read that image (I assume it’s an array of strings containing the paths to the images);
//and use the current string as the new source for the image element;



$("button#right").click(function onArrowClicked(){
  playerIndex++;
  if(playerIndex > players.length - 1) {
    playerIndex = 0;
  }
  $("#player_image").attr("src", players[playerIndex]);
});
$("button#left").click(function onArrowClicked(){
  playerIndex--;
  if(playerIndex < 0) {
    playerIndex = players.length - 1;
  }
  $("#player_image").attr("src", players[playerIndex]);
});

$("#play").click(function () {
  startGame();
});


// functions for drawing elements on the screen
  function drawTiles() {
    rows.forEach(function(tileType, rowIndex){
      for(var i = 0; i < boardWidth; i++) {
        var newTile = $("<img src='images/" + tileType + "-block.png'>");
        newTile.css({
          "position": "absolute",
          "top": tileHeight * rowIndex + 34 + "px",
          "left": tileWidth * i + "px",
          "z-index": -1
        });
        game.append(newTile);
      }
    })
  }

  function drawPlayer() {
    var newPlayer = $("<img class='element' id='player'>");
    newPlayer.attr("src", players[playerIndex]);
    game.append(newPlayer);
  }


  function drawObstacles() {
    levels[crtLevel].obstacles.forEach(function(obstacle) {
      var newObstacle = $("<img class='element' src='images/Rock.png'>");
      newObstacle.css({
        left: (tileWidth * obstacle.tileX) + 'px',
        top: (tileHeight * obstacle.tileY) + 'px',
        position: 'absolute'
      })
      game.append(newObstacle);
    })
  }

  function drawGems() {
    levels[crtLevel].gems.forEach(function(gem, index){
      var newGem = $('<img class="element" id = "gem' + index + '" src="images/rsz_gem_orange.png">');
      newGem.css({
        left: (tileWidth * gem.tileX + 25)  + "px",
        top: (tileHeight * gem.tileY + 65)  +"px",
        position: 'absolute'
      });
      game.append(newGem);
    });
  }

  // lives on screen
  function drawLives() {
    for(var i = 0; i < numberOfLives; i++) {
      var newLife = $("<img id='heartImg' src='images/rsz_heart.png'>");
      newLife.css("margin", "5px");
      game.find('.lives').append(newLife);
    }
  }


  function drawEnemies() {
    levels[crtLevel].enemies.forEach(function (enemy, index){
      var newEnemy = $('<img class="element" id="bug' + index + '" src="images/enemy-bug.png">');
      var scaleX = (enemy.speedX > 0) ? 1 : -1
      newEnemy.css({
        "position": "absolute",
        "left": (tileWidth * enemy.initialTileX) + "px",
        "top": (tileHeight * enemy.initialTileY) + "px",
        "transform": "scaleX(" + scaleX +")"
      });
      game.append(newEnemy);
    });
  }

  function updateBugs(){
    levels[crtLevel].enemies.forEach(function(enemyObj, index){
      var crtEnemy = $("#bug"+index);
      var crtLeft = parseInt(crtEnemy.css('left'));
      var newLeft = (crtLeft + enemyObj.speedX) + 'px';
      crtEnemy.css('left', newLeft);
      setLimitForBug(enemyObj, index);
    });
    detectCollision();
  }

  function setLimitForBug(enemyObj, index) {
    var bugLeft = parseInt($('#bug'+index).css('left'));
    var bugWidth = $('#bug'+index).width();
    var gameWidth = boardWidth * tileWidth;
    if( (enemyObj.speedX > 0 && bugLeft > gameWidth) ||
        (enemyObj.speedX < 0 && bugLeft < -bugWidth)
    ) {
      $('#bug' + index).css('left', enemyObj.initialTileX * tileWidth + "px");
    }
  }

  function detectCollision() {
    levels[crtLevel].enemies.forEach(function(enemy, index) {
      var bugLeft = parseInt($("#bug"+index).css("left"));
      //console.log("this is the css left property of " +bugLeft);
      var bugWidth = $("#bug"+index).width();
      var playerLeft = parseInt($("#player").css("left"));
      //console.log("this is the css left property of " + playerLeft);
      var playerWidth = $("#player").width();
      //console.log("this is the width property of player " + playerWidth);
      if(enemy.initialTileY === playerTileY &&
        bugLeft < playerLeft + playerWidth &&
        bugLeft + bugWidth > playerLeft
      ) {
          playerTileX = initialPlayerTileX;
          playerTileY = initialPlayerTileY;
          numberOfLives--;
          console.log(numberOfLives);
          $("#heartImg").last().remove();
          checkGameOver();
      }
    });
  }

  function checkGameOver() {
    if(numberOfLives <= 0) {
      $(".game_lost #player_game_lost").attr("src", players[playerIndex]);
      $(".game_lost").show();
    }
  }

  $(".game_lost button#yes").click(function(){
    startGame();
  });


 //  logic for player
  function move(deltaX, deltaY) {
    if(canMove(deltaX, deltaY)) {
      playerTileX += deltaX;
      playerTileY += deltaY;
    }
    checkIfCollectGem();
    checkIfOnGate();
  }

  function canMove(deltaX, deltaY) {
    if(playerTileX + deltaX < 0 || playerTileX + deltaX > boardWidth - 1) return;
    if(playerTileY + deltaY < 0 || playerTileY + deltaY > boardHeight - 1) return;

    var obstacleFound = false;
    levels[crtLevel].obstacles.forEach(function(obstacle) {
      if(obstacle.tileX == playerTileX + deltaX && obstacle.tileY == playerTileY + deltaY) {
        obstacleFound = true;
      }
    })
    return !obstacleFound;
  }

  // logic for gems and open gate after collecting them
  function checkIfCollectGem() {
    levels[crtLevel].gems.forEach(function(gem, index){
      if(gem.tileX == playerTileX &&
        gem.tileY == playerTileY &&
        !gem.taken
      ) {
        collectGem(gem, index);
      }
    });
  }

  function collectGem(gem, index){
    $("#gem"+index).remove();
    gem.taken = true;
    totalScore += (crtLevel + 1) * 100;
    score++;
    updateScore();
    maybeOpenGate();
  }


  function maybeOpenGate() {
    if(levels[crtLevel].gems.length === score) {
      openGate();
    }
  }


  function openGate() {
    var gate = $("<img class='element' src='images/gate.png'>");
    gate.css({
      "position": "absolute",
      "left": gateX * tileWidth + "px",
      "top": -5 + "px"
    });
    game.append(gate);
  }

  function checkIfOnGate() {
    if(gateX === playerTileX && playerTileY === 0 && levels[crtLevel].gems.length === score) {
      if(levels[crtLevel+1]) {
        goToNextLevel();
      } else {
        $(".game_won").show();
      }
    }
  }

// game
  function goToNextLevel() {
    crtLevel++;
    startLevel();
  }

  function startLevel() {
    $(".element").remove();
    score = 0;
    $("#current_level").text("Level: " + crtLevel);
    playerTileX = initialPlayerTileX;
    playerTileY = initialPlayerTileY;
    drawGems();
    drawObstacles();
    drawEnemies();
    updateScore();
    drawPlayer();
    if(updateBugsInterval) clearInterval(updateBugsInterval);
    updateBugsInterval = setInterval(updateBugs, 30);
  }

  function updateScore() {
    $("#current_score").text("Score: " + totalScore);
  }



  requestAnimationFrame(update);
  function update() {
    requestAnimationFrame(update);
    $('#player').css({
      left: (tileWidth * playerTileX) + 'px',
      top: (tileHeight * playerTileY) + 'px'
    })
  }
}
