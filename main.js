$(document).ready(initGame);

function initGame() {
  var playerTileX = 2;
  var playerTileY = 5;
  var tileWidth = 101;
  var tileHeight = 83;
  var tileImageHeight = 171;
  var boardWidth = 8;
  var boardHeight = 6;
  var score = 0;
  var game = $('#game');

  var rows = [
    "water", "stone", "stone", "stone", "grass", "grass"
  ];

  var crtLevel = 0;
  var gateX = Math.round(Math.random() * 4);
  var numberOfLives = 3;

  $(window).keypress(onKeyPress);
  function onKeyPress(event) {
    switch(event.key) {
      case "s":
        move(0,1);
        break;
      case "w":
        move(0,-1);
        break;
      case "a":
        move(-1,0);
        break;
      case "d":
        move(1,0);
        break;
    }
  }
  drawTiles();
  startLevel();

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
      var newGem = $('<img class="element" id = "gem' + index + '" src="images/Gem_Orange.png">');
      newGem.css({
        left: (tileWidth * gem.tileX) + "px",
        top: (tileHeight * gem.tileY) + "px",
        position: 'absolute'
      });
      game.append(newGem);
    });
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

  var interval = setInterval(updateBugs, 20);

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
          playerTileX = 2;
          playerTileY = 5;
          $("#heartImg").last().remove();
      }
    });
  }

  function move(deltaX, deltaY) {
    if(canMove(deltaX, deltaY)) {
      playerTileX += deltaX;
      playerTileY += deltaY;
    }
    checkIfCollectGem();
    checkIfOnGate();
  }


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
    score++;
    updateScore();
    maybeOpenGate();
  }

  function maybeOpenGate() {
    if(levels[crtLevel].scoreRequired === score) {
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
    if(gateX === playerTileX && playerTileY === 0 && levels[crtLevel].scoreRequired === score) {
      if(levels[crtLevel+1]) {
        goToNextLevel();
      }
    }
  }

  function goToNextLevel() {
    console.log('goToNextLevel()');
    crtLevel++;
    startLevel();
  }

  function startLevel() {
    $(".element").remove();
    score = 0;
    playerTileX = 2;
    playerTileY = 5;
    drawGems();
    drawObstacles();
    drawEnemies();
    updateScore();
  }

  function updateScore() {
    $("#current_score").text("Score: " + score);
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


  function showLives() {
    for(var i = 0; i < numberOfLives; i++) {
      var newLife = $("<img id='heartImg' src='images/rsz_heart.png'>");
      newLife.css("margin", "5px");
      game.find('.lives').append(newLife);
    }
  }

  showLives();

  function showScore() {
    game.append('<h2 id="current_score"> Score:' + score + '</h2>');
    game.find('#current_score').css({
      "line-height": "50px",
      "color": "red"
    });
  }
  showScore();

  requestAnimationFrame(update);
  function update() {
    requestAnimationFrame(update);
    $('#player').css({
      left: (tileWidth * playerTileX) + 'px',
      top: (tileHeight * playerTileY) + 'px'
    })
  }
}
