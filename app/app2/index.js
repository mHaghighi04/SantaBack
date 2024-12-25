const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestGreen";
const paddle1Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50;
let intervalID;
let ballSpeedX;
let ballSpeedY;
let cumilitiveSpeedY
let ballX = gameWidth/2;
let ballY = gameHeight/2;
let ballXDirection;
let ballYDirection;
let player1score = 0;
let paddle1 = {
    width: 100,
    height: 25,
    x: gameWidth/2 - 50,
    y: gameHeight - 25
};

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

gameStart();
drawPaddles();

function gameStart(){
    createBall();
    nextTick();
};
function nextTick(){
    intervalID = setTimeout(()=>{
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        if(ballYDirection > 0){
            ballSpeedY += 0.03
        }
        else{
            ballSpeedY -= 0.03
        }
        nextTick();
    }, 10)
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function drawPaddles(){
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
};
function createBall(){
    ballSpeedX = 0.5;
    ballSpeedY = 1;
    cumilitiveSpeedY = 5;
    if(Math.round(Math.random()) > 0.5){
        ballXDirection = 1;
    }
    else{
        ballXDirection = -1;
    }
    if(Math.round(Math.random()) == 1){
        ballYDirection = Math.random() * 0.25 + 0.75;
    }
    else{
        ballYDirection = -1 * Math.random() * 0.25 + 0.75;
    }
    ballX = gameWidth/2;
    ballY = gameHeight/2;
    drawBall(ballX, ballY);
};
function moveBall(){
    ballX += (ballSpeedX * ballXDirection);
    ballY += (ballSpeedY * ballYDirection);
};
function drawBall(ballX, ballY){
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI)
    ctx.stroke();
    ctx.fill();
};
function checkCollision(){
    if(ballX <= 0 + ballRadius){
        ballXDirection *= -1;
    }
    if(ballX >= gameWidth - ballRadius){
        ballXDirection *= -1;
    }
    if(ballY <= ballRadius){
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight){
        resetGame();
        return;
    }
    if(ballY >= paddle1.y - ballRadius){
        if(ballX > paddle1.x && ballX < paddle1.x + paddle1.width){
            ballY = (paddle1.y - paddle1.height + 10);
            ballYDirection *= -1;
            ballSpeedX += 0.2;
            ballSpeedY = cumilitiveSpeedY;
            cumilitiveSpeedY += 0.1;
            player1score+=1;
            updateScore();
        }
    }
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    console.log(keyPressed)
    const paddle1Left = 65
    const paddle1Right = 68
    switch(keyPressed){
        case(paddle1Left):
            if(paddle1.x > 0){
                paddle1.x -= paddleSpeed;
            }
            break;
        case(paddle1Right):
            if(paddle1.x < gameWidth - paddle1.width){
                paddle1.x += paddleSpeed;
            }
            break;
    }


};
function updateScore(){
    scoreText.textContent =  `${player1score}`;

};
function resetGame(){
    player1score = 0;
    paddle1 = {
        width: 100,
        height: 25,
        x: paddle1.x,
        y: paddle1.y
    };

    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    cumilitiveSpeedY = 1
    gameStart();
};
