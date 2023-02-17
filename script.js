"use strict";

import("./swiped-events.js");

// Settings

let snakeSize = 25;
let playgroundSizeX = 500;
let playgroundSizeY = 500;
let gameSpeed = 100;
let playgroundColor = "#333";
let snakeColor = "white";
let foodColor = "#e74c3c";

// Definition of start position of snake

let startX = Math.floor(playgroundSizeX / snakeSize / 2) * snakeSize;
let startY = Math.floor(playgroundSizeY / snakeSize / 2 + 1) * snakeSize;

// Selection of canvas element

let canvasSelect = document.querySelector("#playground");
let canvas = canvasSelect.getContext("2d");

let setWidth = document.querySelector(".playground-cont").offsetWidth;
let canvasSet = document.querySelector("#playground");

canvasSet.style.width = setWidth + "px";
canvasSet.style.height = setWidth + "px";

// Create default snake

let defaultSnakePosition = [
  {
    x: startX,
    y: startY,
  },
  {
    x: startX - snakeSize,
    y: startY,
  },
  {
    x: startX - snakeSize * 2,
    y: startY,
  },
];
let defaultSnakeDirection = "right";
let defaultSnakeDeletedPart = {
  x: startX - snakeSize * 2,
  y: startY,
};

let snake = {
  position: JSON.parse(JSON.stringify(defaultSnakePosition)),
  direction: defaultSnakeDirection,
  deletedPart: defaultSnakeDeletedPart,

  // Fonction for mooving snake | if ateFood is true, make snake longer

  move: function (ateFood, direction) {
    canvas.fillStyle = playgroundColor;
    canvas.fillRect(
      this.deletedPart.x,
      this.deletedPart.y,
      snakeSize,
      snakeSize
    );

    //jin jang
    if (game.type == "jinjang") {
      if (
        !(
          food.position.x == playgroundSizeX - this.deletedPart.x - snakeSize &&
          food.position.y == playgroundSizeY - this.deletedPart.y - snakeSize
        )
      ) {
        canvas.fillRect(
          playgroundSizeX - this.deletedPart.x - snakeSize,
          playgroundSizeY - this.deletedPart.y - snakeSize,
          snakeSize,
          snakeSize
        );
      }
    }

    !ateFood ? this.position.pop() : "";
    this.deletedPart = this.position[this.position.length - 1];
    switch (direction) {
      case "right":
        this.position.unshift({
          x: this.position[0].x + snakeSize,
          y: this.position[0].y,
        });
        break;
      case "left":
        this.position.unshift({
          x: this.position[0].x - snakeSize,
          y: this.position[0].y,
        });
        break;
      case "up":
        this.position.unshift({
          x: this.position[0].x,
          y: this.position[0].y - snakeSize,
        });
        break;
      case "down":
        this.position.unshift({
          x: this.position[0].x,
          y: this.position[0].y + snakeSize,
        });
        break;
    }
    this.position.forEach((snakePart) => {
      canvas.fillStyle = snakeColor;
      canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);

      //jin jang
      if (game.type == "jinjang") {
        canvas.fillStyle = foodColor;
        if (
          !(
            food.position.x == playgroundSizeX - snakePart.x - snakeSize &&
            food.position.y == playgroundSizeY - snakePart.y - snakeSize
          )
        ) {
          canvas.fillRect(
            playgroundSizeX - snakePart.x - snakeSize,
            playgroundSizeY - snakePart.y - snakeSize,
            snakeSize,
            snakeSize
          );
        }
      }
    });
  },
};

// Object food - position, generation of new food on playground

let food = {
  position: {
    x: 0,
    y: 0,
  },

  previousPosition: {
    x: 0,
    y: 0,
  },

  generateNew: function () {
    let allPositions = [];
    for (let i = 0; i < playgroundSizeX; i = i + snakeSize) {
      for (let j = 0; j < playgroundSizeY; j = j + snakeSize) {
        allPositions.push({ x: i, y: j });
      }
    }
    snake.position.forEach((snakePart) => {
      allPositions = allPositions.filter((element) => {
        return !(snakePart.x == element.x && snakePart.y == element.y);
      });
    });
    this.position =
      allPositions[Math.floor(Math.random() * allPositions.length)];
    canvas.fillStyle = foodColor;
    canvas.fillRect(this.position.x, this.position.y, snakeSize, snakeSize);
  },
};

let game = {
  playing: false,
  isNewGame: false,
  score: 0,
  pressedKey: "",
  type: "normal",

  // Function check if snake collide with border or himself
  isCollision: function (actualDirection) {
    let findDuplicate = snake.position.filter((oneValue) => {
      return (
        oneValue.x == snake.position[0].x && oneValue.y == snake.position[0].y
      );
    });

    // jin jang
    if (game.type == "jinjang") {
      let jinJang = false;
      snake.position.forEach((snakePart) => {
        snake.position.forEach((snakePart2) => {
          if (
            snakePart.x == playgroundSizeX - snakePart2.x - snakeSize &&
            snakePart.y == playgroundSizeY - snakePart2.y - snakeSize
          ) {
            jinJang = true;
          }
        });
      });
      if (jinJang) {
        return true;
      }
    }

    if (findDuplicate.length > 1) {
      return true;
    } else if (actualDirection == "right") {
      return snake.position[0].x >= playgroundSizeX;
    } else if (actualDirection == "left") {
      return snake.position[0].x < 0;
    } else if (actualDirection == "up") {
      return snake.position[0].y < 0;
    } else if (actualDirection == "down") {
      return snake.position[0].y >= playgroundSizeY;
    }
  },

  newGame: function () {
    game.getSettings();
    game.score = 0;
    document.querySelector("#actual-score strong").textContent = game.score;
    game.isNewGame = true;

    snake.position = JSON.parse(JSON.stringify(defaultSnakePosition));
    snake.direction = defaultSnakeDirection;
    snake.deletedPart = defaultSnakeDeletedPart;

    canvas.fillStyle = playgroundColor;
    canvas.fillRect(0, 0, playgroundSizeX, playgroundSizeY);

    // Render first food on playground
    food.generateNew();

    // Render start snake position
    snake.position.forEach((snakePart) => {
      canvas.fillStyle = snakeColor;
      canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
      // jin jang
      if (game.type == "jinjang") {
        canvas.fillStyle = foodColor;
        if (
          !(
            food.position.x == playgroundSizeX - snakePart.x - snakeSize &&
            food.position.y == playgroundSizeY - snakePart.y - snakeSize
          )
        ) {
          canvas.fillRect(
            playgroundSizeX - snakePart.x - snakeSize,
            playgroundSizeY - snakePart.y - snakeSize,
            snakeSize,
            snakeSize
          );
        }
      }
    });

    document.getElementById("form-save").style.display = "none";
    document.getElementById("unsaved").style.display = "block";
    document.getElementById("saved").style.display = "none";
  },

  runGame: function () {
    if (game.pressedKey == "ArrowRight" && snake.direction != "left") {
      snake.direction = "right";
    } else if (game.pressedKey == "ArrowLeft" && snake.direction != "right") {
      snake.direction = "left";
    } else if (game.pressedKey == "ArrowUp" && snake.direction != "down") {
      snake.direction = "up";
    } else if (game.pressedKey == "ArrowDown" && snake.direction != "up") {
      snake.direction = "down";
    }

    let ateFood =
      food.previousPosition.x == snake.position[0].x &&
      food.previousPosition.y == snake.position[0].y;

    snake.move(ateFood, snake.direction);

    if (
      food.position.x == snake.position[0].x &&
      food.position.y == snake.position[0].y
    ) {
      food.previousPosition = food.position;
      game.score++;
      food.generateNew();
      document.querySelector("#actual-score strong").textContent = game.score;
    }

    if (!game.isCollision(snake.direction)) {
      setTimeout(game.runGame, gameSpeed);
    } else {
      game.playing = false;
      game.isNewGame = false;
      document.getElementById("form-save").style.display = "block";
      document.querySelector("#form-score").textContent = game.score;
    }
  },

  getSettings: function () {
    let settings = JSON.parse(localStorage.getItem("settings"));
    if (settings) {
      game.type = settings.type;
      gameSpeed = Number(settings.speed);
    }
  },
};

let page = {
  getLeaderboard: function () {
    let localLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    let scoreContainer = document.getElementById("score-container");
    scoreContainer.innerHTML = "";
    if (Array.isArray(localLeaderboard)) {
      localLeaderboard.forEach((oneResult) => {
        let newP = document.createElement("p");
        newP.innerHTML = `<strong>${oneResult.score}</strong> - ${oneResult.name == "" ? "<em>bezejmenný hráč</em>" : oneResult.name
          }`;
        scoreContainer.appendChild(newP);
      });
    } else {
      let newP = document.createElement("p");
      newP.textContent = "Zatím není uloženo žádné skóre. Zahrajte si hru.";
      scoreContainer.appendChild(newP);
    }
  },

  pageView: function (page) {
    if (page == "settings") {
      document.getElementById("nastaveni-hry").style.display = "block";
      document.getElementById("o-projektu").style.display = "none";
      document.getElementById("nejlepsi-skore").style.display = "none";
    } else if (page == "about") {
      document.getElementById("nastaveni-hry").style.display = "none";
      document.getElementById("o-projektu").style.display = "block";
      document.getElementById("nejlepsi-skore").style.display = "none";
    } else {
      document.getElementById("nastaveni-hry").style.display = "none";
      document.getElementById("o-projektu").style.display = "none";
      document.getElementById("nejlepsi-skore").style.display = "block";
      this.getLeaderboard();
    }
  },

  saveScore: function (name) {
    let localLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (!Array.isArray(localLeaderboard)) {
      localLeaderboard = [];
    }
    localLeaderboard.push({
      name: name,
      score: game.score,
    });
    localLeaderboard.sort(function (a, b) {
      if (a.score > b.score) {
        return -1;
      } else if (a.score < b.score) {
        return 1;
      } else {
        return 0;
      }
    });
    localLeaderboard.splice(10, Infinity);
    localStorage.setItem("leaderboard", JSON.stringify(localLeaderboard));
    document.getElementById("unsaved").style.display = "none";
    document.getElementById("saved").style.display = "block";
    document.getElementById("form-name").value = "";
    this.getLeaderboard();
  },
};

////////////////////////////////
// Snake Game starts here
////////////////////////////////

if (location.hash == "#o-projektu") {
  page.pageView("about");
} else if (location.hash == "#nastaveni-hry") {
  page.pageView("settings");
} else {
  page.pageView("score");
}

game.newGame();
page.getLeaderboard();

document.addEventListener("keydown", (event) => {
  game.pressedKey = event.key;

  if (
    (event.key == "ArrowRight" ||
      event.key == "ArrowLeft" ||
      event.key == "ArrowUp" ||
      event.key == "ArrowDown") &&
    game.playing == false &&
    game.isNewGame == true
  ) {
    game.playing = true;
    game.runGame();
  }
  if (game.playing) {
    event.preventDefault();
  }
});

document.querySelector(".but-new-game").addEventListener("click", (event) => {
  event.preventDefault();
  game.newGame();
});

document.querySelector(".but-new-game2").addEventListener("click", (event) => {
  event.preventDefault();
  game.newGame();
});

document.querySelector("#but-best-score").addEventListener("click", () => {
  page.pageView("score");
});

document.querySelector("#but-settings").addEventListener("click", () => {
  page.pageView("settings");
});

document.querySelector("#but-about").addEventListener("click", () => {
  page.pageView("about");
});

document.getElementById("form-save").addEventListener("submit", (event) => {
  event.preventDefault();
  page.saveScore(event.target.formName.value);
});

document.getElementById("settings").addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.target.settingsType.value);
  if (event.target.settingsType.value && event.target.settingsSpeed.value) {
    let settings = {
      type: event.target.settingsType.value,
      speed: event.target.settingsSpeed.value,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
    game.newGame();
  }
});

document
  .querySelector("#playground")
  .addEventListener("swiped", function (event) {
    switch (event.detail.dir) {
      case "left":
        game.pressedKey = "ArrowLeft";
        break;
      case "right":
        game.pressedKey = "ArrowRight";
        break;
      case "up":
        game.pressedKey = "ArrowUp";
        break;
      case "down":
        game.pressedKey = "ArrowDown";
        break;
    }
    if (game.playing == false && game.isNewGame == true) {
      game.playing = true;
      game.runGame();
    }
  });
