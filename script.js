"use strict";
// Settings

let snakeSize = 20 // Size of one square of snake
let playgroundSizeX = 400 // Width of playground
let playgroundSizeY = 400 // Height of playground
let gameSpeed = 100
let playgroundColor = "rgb(53, 127, 247)"
let snakeColor = "black"
let foodColor = "red"

// Definition of start position of snake

let startX = Math.floor(playgroundSizeX /snakeSize / 2) * snakeSize
let startY = Math.floor(playgroundSizeY /snakeSize / 2) * snakeSize

// Selection of canvas element
let canvasSelect = document.querySelector("#playground")
let canvas = canvasSelect.getContext("2d")

// Create default snake

const defaultSnakePosition = [{
        x: startX,
        y: startY
    },{
        x: startX - snakeSize,
        y: startY
    },{
        x: startX - (snakeSize * 2),
        y: startY
    }]
const defaultSnakeDirection = "right"
const defaultSnakeDeletedPart = {
    x: startX - (snakeSize * 2),
    y: startY
}


let snake = {
    position: JSON.parse(JSON.stringify(defaultSnakePosition)),
    direction: defaultSnakeDirection,
    deletedPart: defaultSnakeDeletedPart,

// Fonction for mooving snake | if ateFood is true, make snake longer

    move: function(ateFood, direction){
        canvas.fillStyle = playgroundColor
        canvas.fillRect(this.deletedPart.x, this.deletedPart.y, snakeSize, snakeSize);
        !ateFood ? this.position.pop() : "" ;
        this.deletedPart = this.position[this.position.length - 1]
        switch(direction){
            case "right":
                this.position.unshift({
                    x: this.position[0].x + snakeSize,
                    y: this.position[0].y
                })
            break;
            case "left":
                this.position.unshift({
                    x: this.position[0].x - snakeSize,
                    y: this.position[0].y
                })
            break;
            case "up":
                this.position.unshift({
                    x: this.position[0].x,
                    y: this.position[0].y - snakeSize
                })
            break;
            case "down":
                this.position.unshift({
                    x: this.position[0].x,
                    y: this.position[0].y + snakeSize
                })
            break;
        }
        this.position.forEach(snakePart => {
            canvas.fillStyle = snakeColor
            canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
        })
    },
}

// Object food - position, generation of new food on playground

let food = {
    position: {
        x: 0,
        y: 0
    },
    previousPosition: {
        x: 0,
        y: 0
    },
    generateNew: function(){
        let allPositions = []
        for(let i = 0; i < playgroundSizeX; i = i+snakeSize){
            for(let j = 0; j < playgroundSizeY; j = j+snakeSize){
                allPositions.push({x: i, y: j})
            }
        }
        snake.position.forEach(snakePart => {
            allPositions = allPositions.filter(element => {
                return !((snakePart.x == element.x) && (snakePart.y == element.y))
            })
        })        
        this.position = allPositions[Math.floor(Math.random() * allPositions.length)]
        canvas.fillStyle = foodColor
        canvas.fillRect(this.position.x, this.position.y, snakeSize, snakeSize);
    }
}

let game = {
    playing: false,
    score: 0,
    pressedKey: "",

    // Function checks if snake collide with border or himself
    isCollision: function(actualDirection){ 
        let findDuplicate = snake.position.filter(oneValue => {
            return (oneValue.x == snake.position[0].x) && (oneValue.y == snake.position[0].y)
        })
        if(findDuplicate.length > 1){
            return true
        }else if(actualDirection == "right"){ 
            return snake.position[0].x >= playgroundSizeX
        }else if(actualDirection == "left"){
            return snake.position[0].x < 0
        }else if(actualDirection == "up"){
            return snake.position[0].y < 0
        }else if(actualDirection == "down"){
            return snake.position[0].y >= playgroundSizeY
        } 
    },

    newGame: function(){
        game.score = 0
       
        snake.position = JSON.parse(JSON.stringify(defaultSnakePosition))        
        snake.direction = defaultSnakeDirection
        snake.deletedPart = defaultSnakeDeletedPart

        canvas.fillStyle = playgroundColor
        canvas.fillRect(0, 0, playgroundSizeX, playgroundSizeY);

        // Render first food on playground
        food.generateNew() 
        
        // Render start snake position
        snake.position.forEach(snakePart => {
        canvas.fillStyle = snakeColor
        canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
        })
    },

    runGame: function(){
        if(game.pressedKey == "ArrowRight" && snake.direction != "left"){
            snake.direction = "right"
        }else if(game.pressedKey == "ArrowLeft" && snake.direction != "right"){
            snake.direction = "left"
        }else if(game.pressedKey == "ArrowUp" && snake.direction != "down"){
            snake.direction = "up"
        }else if(game.pressedKey == "ArrowDown" && snake.direction != "up"){
            snake.direction = "down"
        } 

        let ateFood = ((food.previousPosition.x == snake.position[0].x) && (food.previousPosition.y == snake.position[0].y)) ? true : false
       
        snake.move(ateFood, snake.direction)
        
        if((food.position.x == snake.position[0].x) && (food.position.y == snake.position[0].y)){
            food.previousPosition = food.position
            game.score++;
            food.generateNew()
            console.log("Score: " + game.score)
        }

        if(!game.isCollision(snake.direction)){setTimeout(game.runGame, gameSpeed)}else{
            game.playing = false
            game.newGame()
        }
    }
}


////////////////////////////////
// Snake Game starts here
////////////////////////////////

game.newGame()

document.addEventListener("keydown", event => {
    event.preventDefault()
    game.pressedKey = event.key

    if((event.key == "ArrowRight" || event.key == "ArrowLeft" || event.key == "ArrowUp" || event.key == "ArrowDown") && game.playing == false){
        game.playing = true
        game.runGame()
    }
})



