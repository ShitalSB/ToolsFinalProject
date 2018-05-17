//declare two variables for life and level counter. and declare two varrable to  changing the frame of enemy.
let count = 1,
    lifesCounter = 3,
    frameCount = 0,
    doubleCount = 0;

// create enemy class with positions, speed and set a property lives to false.
var Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.lives = false;
};

//create a method on enemy prototype callled life that cntrol the lifes.
Enemy.prototype.life = function () {
    //chek if enemy's life is true then set it to false.
    if (this.lives) {
        this.lives = false;
        // then chek if lifecounter is 1 then call winnerAndGameOver function and pass the string 'lozer'. else decrease the lifecounter by 1.
        if (lifesCounter == 1) {
            winnerAndGameover('lozer');
        } else {
            document.getElementById('life').textContent = `Life =${--lifesCounter}`;
        }
    }
}

//create a method update() on enemy prototype, that invoke every time by engin.js
Enemy.prototype.update = function (dt) {
    // multiply any movement by the dt parameter which will ensure the game runs at the same speed for all computers.
    this.x += this.speed * 50 * dt;
    //when off canvas, reset position of enemy to move across again
    if (this.x >= 500) {
        this.x = -100;
    }
    // Check for collision player and enemies.
    if ((player.x < this.x + 90 && this.x < player.x + 80 && this.y + 24 > player.y && player.y + 90 > this.y)) {
        // Set the lives to true and call that life method and reset the player's position. 
        this.lives = true;
        setTimeout(() => {
            player.x = 200;
            player.y = 410;
            this.life();
        }, 150);
        // set the background for few minute and reset it again.
        setTimeout(() => {
            document.querySelector('body').style.backgroundImage = "none";
        }, 410);
        document.querySelector('body').style.backgroundImage = "url('images/boom.png')";
    }
};

// create an array of frames(images) and set it using  
Enemy.prototype.render = function () {
    let arrimg = ['images/frames 0.png', 'images/frames 1.png', 'images/frames 2.png', 'images/frames 3.png', 'images/frames 4.png', 'images/frames 5.png', 'images/frames 6.png', 'images/frames 7.png', 'images/frames 8.png', 'images/frames 9.png', 'images/frames 10.png'];
    // draw image using arrimg and enemy positions.
    ctx.drawImage(Resources.get(arrimg[frameCount % 11]), this.x, this.y);
    // set the framecounter by cheking the doublecounter. and increase doublecounter for next itration.
    if (doubleCount % 10 == 0)
        frameCount++;
    doubleCount++;
}

// create player and set the default position.
const Player = function (x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function () {

}

// draw image of player.
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// create instance of Player.
const player = new Player(200, 410);

//create mathod call handleInput()
Player.prototype.handleInput = function (key) {
    // move the player 1 box left right up down.
    if (key == 'right' && this.x < 410) {
        this.x += 101;
    } else if (key == 'left') {
        this.x -= 101;
    } else if (key == 'up') {
        this.y -= 85;
    } else if (key == 'down') {
        this.y += 85;
    }
    // increase the level when it rich the water. and reset the player to it's deafault position.
    if (this.y < 40) {
        this.y = 410;
        this.x = 200;
        document.getElementById("score").textContent = `Best Level = 10,Current Level = ${++count}`;
        // check level counter if it is > then 10 then call the winnerAndGameover function and pass string 'winner'.
        if (count > 10) {
            winnerAndGameover('winner');
        }
        // increase the enemy and speed of enemy each level.
        if (count <= 10) {
            increaseLevel();
        }
    }
    //Prevent player from moving beyond canvas wall boundaries
    if (this.x > 400) {
        this.x = 400;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y > 410) {
        this.y = 410;
    }
}

// create a function that reset whole game;
function resetGame() {
    //reset the counters.
    count = 1;
    lifesCounter = 3;
    document.getElementById("score").textContent = `Best Level = 10,Current Level = ${count}`;
    document.getElementById('life').textContent = `Life = ${lifesCounter}`;
    // remove all extra enemy
    for (let i = 0; allEnemies.length > 3; i++) {
        allEnemies.pop();
    }
    // reset the player's position
    player.x = 200;
    player.y = 410;
    // reset the spped of enemies.
    enemies1.speed = 1;
    enemies2.speed = 1.8;
    enemies3.speed = 1.4;
    //remove the winning or lossing popup from window if there is.
    if (document.querySelector('.congo1')) {
        document.querySelector('.congo1').remove();
    }
}

// create intance of enemies and insert it into allEnemies.
const enemies1 = new Enemy(-200, 130, 1);
const enemies2 = new Enemy(-300, 210, 1.8);
const enemies3 = new Enemy(-100, 290, 1.4);
var allEnemies = [enemies1, enemies2, enemies3];

// function for increasing level(that increase enimies and speed).
function increaseLevel() {
    // increase enemies.
    // array for Y position
    let yposArr = [130, 210, 290];
    // array for X position.
    let xposArr = [-100, -200, -300, -410, -500];
    // create intance of enemies with randomly speed and position and add it to allenimies array.
    const enemy = new Enemy(xposArr[Math.floor(Math.random() * xposArr.length)], yposArr[Math.floor(Math.random() * yposArr.length)], randomNumber(1, 5));
    allEnemies.push(enemy);
    //increase the speed by point 2.
    for (const enemy of allEnemies) {
        enemy.speed += 0.2;
    }
}

// function for selecting random elemenet.
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// create popup based on string.
function winnerAndGameover(string) {
    // create background
    const congo = document.createElement("div");
    congo.setAttribute('class', 'congo1');

    // create actual popup with a button.
    const div = document.createElement("div");
    div.setAttribute('class', 'congo');
    const playagain = document.createElement("button");
    playagain.textContent = "Play Again";
    playagain.setAttribute('class', 'playagain');

    // add  event listener for reseting the game.
    playagain.addEventListener('click', resetGame);
    // display appropriate text based on parameter 'string'
    if (string == 'winner') {
        div.innerHTML = `<h1>Congratulations You won!!!!!! <p>😍😍😍😍</p></h1><p>Your highest level is : ${count-1}`;
        div.classList.add('rotate');
    } else {
        div.innerHTML = `<h1>oops you lost you lifes <p>😖😖😖😖</p></h1><p>Your highest level is : ${count-1}</p>`;
        div.classList.add('bounceInDown');
    }
    // add elements to webpage.
    div.appendChild(playagain);
    congo.appendChild(div);
    document.body.appendChild(congo);
}

//This listens for key presses and sends the keys to your Player.handleInput() method.
document.addEventListener('keyup', function (e) {
    // check if there is congratulation or losing popup is not avilable then accept input. and send it to handleInput.
    if (!document.querySelector('.congo')) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
    }
});