var levels = [
  {
    "scoreRequired": 1,
    "obstacles": [],
    "gems": [{"tileX": 2, "tileY": 3}],
    "enemies": [
      {
        "initialTileX": 0,
        "initialTileY": 2,
        "speedX": 2,
        "speedY": 0,
      }
    ],
  },
  {
    "scoreRequired": 2,
    "obstacles": [{"tileX": 1, "tileY": 1},{"tileX": 2, "tileY": 2},{"tileX": 3, "tileY": 3},{"tileX": 4, "tileY": 4}],
    "gems": [{"tileX": 1, "tileY": 3}, {"tileX": 3, "tileY": 4}],
    "enemies": [
      {
        "initialTileX": -1,
        "initialTileY": 1,
        "speedX": 10,
        "speedY": 0,
      },
      {
        "initialTileX": 6,
        "initialTileY": 4,
        "speedX": -10,
        "speedY": 0,
      }
    ]
  },
  {
    "scoreRequired": 1,
    "obstacles": [{"tileX": 1, "tileY": 1},{"tileX": 3, "tileY": 3}],
    "gems": [{"tileX": 1, "tileY": 3}],
    "enemies": [
      {
        "initialTileX": -1,
        "initialTileY": 2,
        "speedX": 10,
        "speedY": 0,
      },
      {
        "initialTileX": 6,
        "initialTileY": 4,
        "speedX": -10,
        "speedY": 0,
      }
    ]
  }

];
