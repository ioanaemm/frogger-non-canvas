$(document).ready(initGame);

function initGame() {
  var playerX = 0;
  var playerY = 0;
  var tileWidth = 101;
  var tileHeight = 83;
  var tileImageHeight = 171;
  var boardWidth = 5;
  var boardHeight = 6;
  var obstacles = [{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4}];
  var gems = [{ x: 2, y: 3}, {x: 3, y: 4}];
  var score = 0;

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
  drawObstacles();
  drawGems();
  function drawObstacles() {
    obstacles.forEach(function(obstacle) {
      var newObstacle = $("<img src='images/Rock.png'></img>");
      newObstacle.css({
        left: (tileWidth * obstacle.x) + 'px',
        top: (tileHeight * obstacle.y) + 'px',
        position: 'absolute'
      })
      $('body').append(newObstacle);
    })
  }

  function drawGems() {
    gems.forEach(function(gem, index){
      var newGem = $('<img id = "gem' + index + '" src="images/Gem_Orange.png"></img>');
      newGem.css({
        left: (tileWidth * gem.x) + "px",
        top: (tileHeight * gem.y) + "px",
        position: 'absolute'
      });
      $('body').append(newGem);
    });
  }
  function move(deltaX, deltaY) {
    if(canMove(deltaX, deltaY)) {
      playerX += deltaX;
      playerY += deltaY;
    }
    // after moving, check to see if there's a gem on the current tile
    for(var i = 0; i < gems.length; i++) {
      if(gems[i].x == playerX && gems[i].y == playerY && !gems[i].taken) {
        $("#gem"+i).remove();
        gems[i].taken = true;
        score++;
      }
    }
    console.log(score);

  }

  function canMove(deltaX, deltaY) {
    if(playerX + deltaX < 0 || playerX + deltaX > boardWidth - 1) {
      return false;
    }
    var obstacleFound = false;
    obstacles.forEach(function(obstacle) {
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