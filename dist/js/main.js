"use strict";

/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function () {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
        if (urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function (url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if (resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function () {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if (isReady()) {
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
'use strict';

//declare two variables for life and level counter. and declare two varrable to  changing the frame of enemy.
var count = 1,
    lifesCounter = 3,
    frameCount = 0,
    doubleCount = 0;

// create enemy class with positions, speed and set a property lives to false.
var Enemy = function Enemy(x, y, speed) {
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
            document.getElementById('life').textContent = 'Life =' + --lifesCounter;
        }
    }
};

//create a method update() on enemy prototype, that invoke every time by engin.js
Enemy.prototype.update = function (dt) {
    var _this = this;

    // multiply any movement by the dt parameter which will ensure the game runs at the same speed for all computers.
    this.x += this.speed * 50 * dt;
    //when off canvas, reset position of enemy to move across again
    if (this.x >= 500) {
        this.x = -100;
    }
    // Check for collision player and enemies.
    if (player.x < this.x + 90 && this.x < player.x + 80 && this.y + 24 > player.y && player.y + 90 > this.y) {
        // Set the lives to true and call that life method and reset the player's position. 
        this.lives = true;
        setTimeout(function () {
            player.x = 200;
            player.y = 410;
            _this.life();
        }, 150);
        // set the background for few minute and reset it again.
        setTimeout(function () {
            document.querySelector('body').style.backgroundImage = "none";
        }, 410);
        document.querySelector('body').style.backgroundImage = "url('images/boom.png')";
    }
};

// create an array of frames(images) and set it using  
Enemy.prototype.render = function () {
    var arrimg = ['images/frames 0.png', 'images/frames 1.png', 'images/frames 2.png', 'images/frames 3.png', 'images/frames 4.png', 'images/frames 5.png', 'images/frames 6.png', 'images/frames 7.png', 'images/frames 8.png', 'images/frames 9.png', 'images/frames 10.png'];
    // draw image using arrimg and enemy positions.
    ctx.drawImage(Resources.get(arrimg[frameCount % 11]), this.x, this.y);
    // set the framecounter by cheking the doublecounter. and increase doublecounter for next itration.
    if (doubleCount % 10 == 0) frameCount++;
    doubleCount++;
};

// create player and set the default position.
var Player = function Player(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function () {};

// draw image of player.
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// create instance of Player.
var player = new Player(200, 410);

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
        document.getElementById("score").textContent = 'Best Level = 10,Current Level = ' + ++count;
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
};

// create a function that reset whole game;
function resetGame() {
    //reset the counters.
    count = 1;
    lifesCounter = 3;
    document.getElementById("score").textContent = 'Best Level = 10,Current Level = ' + count;
    document.getElementById('life').textContent = 'Life = ' + lifesCounter;
    // remove all extra enemy
    for (var i = 0; allEnemies.length > 3; i++) {
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
var enemies1 = new Enemy(-200, 130, 1);
var enemies2 = new Enemy(-300, 210, 1.8);
var enemies3 = new Enemy(-100, 290, 1.4);
var allEnemies = [enemies1, enemies2, enemies3];

// function for increasing level(that increase enimies and speed).
function increaseLevel() {
    // increase enemies.
    // array for Y position
    var yposArr = [130, 210, 290];
    // array for X position.
    var xposArr = [-100, -200, -300, -410, -500];
    // create intance of enemies with randomly speed and position and add it to allenimies array.
    var enemy = new Enemy(xposArr[Math.floor(Math.random() * xposArr.length)], yposArr[Math.floor(Math.random() * yposArr.length)], randomNumber(1, 5));
    allEnemies.push(enemy);
    //increase the speed by point 2.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = allEnemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _enemy = _step.value;

            _enemy.speed += 0.2;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

// function for selecting random elemenet.
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// create popup based on string.
function winnerAndGameover(string) {
    // create background
    var congo = document.createElement("div");
    congo.setAttribute('class', 'congo1');

    // create actual popup with a button.
    var div = document.createElement("div");
    div.setAttribute('class', 'congo');
    var playagain = document.createElement("button");
    playagain.textContent = "Play Again";
    playagain.setAttribute('class', 'playagain');

    // add  event listener for reseting the game.
    playagain.addEventListener('click', resetGame);
    // display appropriate text based on parameter 'string'
    if (string == 'winner') {
        div.innerHTML = '<h1>Congratulations You won!!!!!! <p>\uD83D\uDE0D\uD83D\uDE0D\uD83D\uDE0D\uD83D\uDE0D</p></h1><p>Your highest level is : ' + (count - 1);
        div.classList.add('rotate');
    } else {
        div.innerHTML = '<h1>oops you lost you lifes <p>\uD83D\uDE16\uD83D\uDE16\uD83D\uDE16\uD83D\uDE16</p></h1><p>Your highest level is : ' + (count - 1) + '</p>';
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
'use strict';

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = function (global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
      win = global.window,
      canvas = doc.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      lastTime;

  canvas.width = 505;
  canvas.height = 606;
  doc.body.appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now();
    window.dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {
    updateEntities(dt);
    // checkCollisions();
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function (enemy) {
      enemy.update(dt);
    });
    player.update();
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = ['images/water-block.png', // Top row is water
    'images/stone-block.png', // Row 1 of 3 of stone
    'images/stone-block.png', // Row 2 of 3 of stone
    'images/stone-block.png', // Row 3 of 3 of stone
    'images/grass-block.png', // Row 1 of 2 of grass
    'images/grass-block.png' // Row 2 of 2 of grass
    ],
        numRows = 6,
        numCols = 9,
        row,
        col;

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function (enemy) {
      enemy.render();
    });

    player.render();
  }

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {}
  // noop


  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load(['images/stone-block.png', 'images/water-block.png', 'images/grass-block.png', 'images/char-boy.png', 'images/frames 0.png', 'images/frames 1.png', 'images/frames 2.png', 'images/frames 3.png', 'images/frames 4.png', 'images/frames 5.png', 'images/frames 6.png', 'images/frames 7.png', 'images/frames 8.png', 'images/frames 9.png', 'images/frames 10.png']);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
}(undefined);