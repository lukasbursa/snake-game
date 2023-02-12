"use strict";
// Settings

let snakeSize = 20 // Size of one square of snake
let playgroundSizeX = 500 // Width of playground
let playgroundSizeY = 500 // Height of playground
let playgroundColor = "rgb(53, 127, 247)"
let snakeColor = "black"
let foodColor = "red"

// Definition of start position of snake

let startX = Math.floor(playgroundSizeX /snakeSize / 2) * snakeSize
let startY = Math.floor(playgroundSizeY /snakeSize / 2) * snakeSize

// Selection of canvas element
let canvasSelect = document.querySelector("#playground")
let canvas = canvasSelect.getContext("2d")

// Create default snake Array

let snake = {
    position: [{
        x: startX,
        y: startY
    },{
        x: startX - snakeSize,
        y: startY
    },{
        x: startX - (snakeSize * 2),
        y: startY
    }],
    direction: "right",
    deletedPart: {
        x: startX - (snakeSize * 2),
        y: startY
    },

// Fonctions for mooving snake | if ateFood is true, make snake longer

    moveRight: function(ateFood){
        canvas.fillStyle = playgroundColor
        canvas.fillRect(this.deletedPart.x, this.deletedPart.y, snakeSize, snakeSize); 
        !ateFood ? this.position.pop(): "";    
        this.deletedPart = this.position[this.position.length - 1]
        this.position.unshift({
            x: this.position[0].x + snakeSize,
            y: this.position[0].y
        })
        this.position.forEach(snakePart => {
            canvas.fillStyle = snakeColor
            canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
        })
    },

    moveLeft: function(ateFood){
        canvas.fillStyle = playgroundColor
        canvas.fillRect(this.deletedPart.x, this.deletedPart.y, snakeSize, snakeSize);
        !ateFood ? this.position.pop() : "" ;
        this.deletedPart = this.position[this.position.length - 1]
        this.position.unshift({
            x: this.position[0].x - snakeSize,
            y: this.position[0].y
        })
        this.position.forEach(snakePart => {
            canvas.fillStyle = snakeColor
            canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
        })
    },

    moveUp: function(ateFood){
        canvas.fillStyle = playgroundColor
        canvas.fillRect(this.deletedPart.x, this.deletedPart.y, snakeSize, snakeSize);
        !ateFood ? this.position.pop() : "" ;
        this.deletedPart = this.position[this.position.length - 1]
        this.position.unshift({
            x: this.position[0].x,
            y: this.position[0].y - snakeSize
        })
        this.position.forEach(snakePart => {
            canvas.fillStyle = snakeColor
            canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
        })
    },

    moveDown: function(ateFood){
        canvas.fillStyle = playgroundColor
        canvas.fillRect(this.deletedPart.x, this.deletedPart.y, snakeSize, snakeSize);
        !ateFood ? this.position.pop() : "" ;
        this.deletedPart = this.position[this.position.length - 1]
        this.position.unshift({
            x: this.position[0].x,
            y: this.position[0].y + snakeSize
        })
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
        this.score = 0
        
        snake.position = [{
            x: startX,
            y: startY
        },{
            x: startX - snakeSize,
            y: startY
        },{
            x: startX - (snakeSize * 2),
            y: startY
        }]
        snake.direction = "right"
        snake.deletedPart = {
            x: startX - (snakeSize * 2),
            y: startY
        }
        

        canvas.fillStyle = playgroundColor
        canvas.fillRect(0, 0, playgroundSizeX, playgroundSizeY);

        food.generateNew() // Render first food on playground
        
        // Render start snake position
        snake.position.forEach(snakePart => {
        canvas.fillStyle = snakeColor
        canvas.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
        })
    },

    runGame: function(){

        // Listen keys and change snake direction
        // document.addEventListener("keydown", event => {
        // event.preventDefault()
        // if(event.key == "ArrowRight" && snake.direction != "left"){
        //     snake.direction = "right"
        // }else if(event.key == "ArrowLeft" && snake.direction != "right"){
        //     snake.direction = "left"
        // }else if(event.key == "ArrowUp" && snake.direction != "down"){
        //     snake.direction = "up"
        // }else if(event.key == "ArrowDown" && snake.direction != "up"){
        //     snake.direction = "down"
        // }    
        // })

        let collision = false
        let ateFood = false
    
        if((food.position.x == snake.position[0].x) && (food.position.y == snake.position[0].y)){
            ateFood = true
            food.generateNew()
            game.score++;
            console.log(game.score)
        }
        //console.log(snake.position[0])
        if(snake.direction == "right"){
         
            snake.moveRight(ateFood)
            collision = game.isCollision(snake.direction)
            
        }else if(snake.direction == "left"){
            snake.moveLeft(ateFood)
            collision = game.isCollision(snake.direction)
        }
        else if(snake.direction == "up"){
            snake.moveUp(ateFood)
            collision = game.isCollision(snake.direction)
        }else if(snake.direction == "down"){
            snake.moveDown(ateFood)
            collision = game.isCollision(snake.direction)
        } 

        if(!collision){setTimeout(game.runGame, 500)}else{
            //alert("Game Over")
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
        if(event.key == "ArrowRight" && snake.direction != "left"){
            snake.direction = "right"
        }else if(event.key == "ArrowLeft" && snake.direction != "right"){
            snake.direction = "left"
        }else if(event.key == "ArrowUp" && snake.direction != "down"){
            snake.direction = "up"
        }else if(event.key == "ArrowDown" && snake.direction != "up"){
            snake.direction = "down"
        } 

    if((event.key == "ArrowRight" || event.key == "ArrowLeft" || event.key == "ArrowUp" || event.key == "ArrowDown") && game.playing == false){
        game.playing = true
        game.runGame()
    }
})



