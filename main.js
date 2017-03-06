$(document).ready(initGame);

function initGame() {
  console.log(levels);
  var playerX = 2;
  var playerY = 5;
  var tileWidth = 101;
  var tileHeight = 83;
  var tileImageHeight = 171;
  var boardWidth = 5;
  var boardHeight = 6;
  var score = 0;

  var rows = [
    "water", "stone", "stone", "stone", "grass", "grass"
  ];

  var crtLevel = 0;
  var gateX = Math.round(Math.random() * 4);


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
  drawObstacles();
  drawGems();
  drawEnemies();




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
        $('body').append(newTile);
      }

    })
  }

  function drawObstacles() {
    levels[crtLevel].obstacles.forEach(function(obstacle) {
      var newObstacle = $("<img class='element' src='images/Rock.png'>");
      newObstacle.css({
        left: (tileWidth * obstacle.x) + 'px',
        top: (tileHeight * obstacle.y) + 'px',
        position: 'absolute'
      })
      $('body').append(newObstacle);
    })
  }

  function drawGems() {
    levels[crtLevel].gems.forEach(function(gem, index){
      var newGem = $('<img class="element" id = "gem' + index + '" src="images/Gem_Orange.png">');
      newGem.css({
        left: (tileWidth * gem.x) + "px",
        top: (tileHeight * gem.y) + "px",
        position: 'absolute'
      });
      $('body').append(newGem);
    });
  }

  function drawEnemies() {
    levels[crtLevel].enemies.forEach(function (enemy){
      var newEnemy = $('<img src="images/enemy-bug.png">');
      newEnemy.css({
        "position": "absolute",
        "left": (tileWidth * enemy.x) + "px",
        "top": (tileHeight * enemy.y) + "px"
      });
      $('body').append(newEnemy);
    });
  }

  function move(deltaX, deltaY) {
    if(canMove(deltaX, deltaY)) {
      playerX += deltaX;
      playerY += deltaY;
    }
    checkIfCollectGem();
    checkIfOnGate();
  }


  function checkIfCollectGem() {
    for(var i = 0; i < levels[crtLevel].gems.length; i++) {
      if(levels[crtLevel].gems[i].x == playerX && levels[crtLevel].gems[i].y == playerY && !levels[crtLevel].gems[i].taken) {
        $("#gem"+i).remove();
        levels[crtLevel].gems[i].taken = true;
        score++;
        openGate();
      }
    }
  }


  function openGate() {
    if(levels[crtLevel].scoreRequired === score) {
      console.log("gate works");
      var gate = $("<img class='element' src='images/gate.png'>");
      gate.css({
        "position": "absolute",
        "left": gateX * tileWidth + "px",
        "top": -5 + "px"
      });
      $('body').append(gate);
    }
  }

  function checkIfOnGate() {
    if(gateX === playerX && playerY === 0 && levels[crtLevel].scoreRequired === score) {
      $(".element").remove();
      if(levels[crtLevel+1]) {
        score = 0;
        crtLevel++;
        drawGems();
        drawObstacles();
      }

    }
  }

  function canMove(deltaX, deltaY) {
    if(playerX + deltaX < 0 || playerX + deltaX > boardWidth - 1) return;
    if(playerY + deltaY < 0 || playerY + deltaY > boardHeight - 1) return;

    var obstacleFound = false;
    levels[crtLevel].obstacles.forEach(function(obstacle) {
      if(obstacle.x == playerX + deltaX && obstacle.y == playerY + deltaY) {
        obstacleFound = true;
      }
    })
    return !obstacleFound;
  }

  requestAnimationFrame(update);
  function update() {
    requestAnimationFrame(update);
    $('#player').css({
      left: (tileWidth * playerX) + 'px',
      top: (tileHeight * playerY) + 'px'
    })
  }
}
