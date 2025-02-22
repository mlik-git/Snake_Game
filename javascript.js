const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const pauseBtn = document.getElementById('pauseBtn');

// 游戏配置
const config = {
    grid: 10,
    tileCount: canvas.width / 10,
    gameSpeed: 300,
    initialSnake: [
        {x: 200, y: 200},
        {x: 190, y: 200},
        {x: 180, y: 200}
    ]
};

// 游戏状态
let gameState = {
    snake: [],
    dx: 10,
    dy: 0,
    food: {x: 0, y: 0},
    score: 0,
    gameRunning: true,
    gamePaused: false,
    gameLoopId: null
};

// 初始化游戏
function initGame() {
    gameState.snake = JSON.parse(JSON.stringify(config.initialSnake));
    gameState.dx = 10;
    gameState.dy = 0;
    gameState.score = 0;
    gameState.gameRunning = true;
    gameState.gamePaused = false;
    scoreDisplay.textContent = `得分：0`;
    generateFood();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    gameLoop();
}

// 生成食物
function generateFood() {
    do {
        gameState.food.x = Math.floor(Math.random() * config.tileCount) * config.grid;
        gameState.food.y = Math.floor(Math.random() * config.tileCount) * config.grid;
    } while (gameState.snake.some(segment => 
        segment.x === gameState.food.x && 
        segment.y === gameState.food.y
    ));
}

// 游戏循环
function gameLoop() {
    if (!gameState.gameRunning || gameState.gamePaused) return;
    
    moveSnake();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    checkCollision();
    
    gameState.gameLoopId = setTimeout(gameLoop, config.gameSpeed);
}

// 移动蛇
function moveSnake() {
    const head = {
        x: gameState.snake[0].x + gameState.dx,
        y: gameState.snake[0].y + gameState.dy
    };
    
    gameState.snake.unshift(head);
    
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        gameState.score += 10;
        scoreDisplay.textContent = `得分：${gameState.score}`;
        generateFood();
    } else {
        gameState.snake.pop();
    }
}

// 绘制蛇
function drawSnake() {
    ctx.fillStyle = 'green';
    gameState.snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, config.grid, config.grid);
    });
}

// 绘制食物
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(gameState.food.x, gameState.food.y, config.grid, config.grid);
}

// 碰撞检测
function checkCollision() {
    const head = gameState.snake[0];
    
    // 边界检测
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height) {
        gameOver();
    }
    
    // 自碰撞检测
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && 
            head.y === gameState.snake[i].y) {
            gameOver();
        }
    }
}

// 暂停/恢复游戏
function togglePause() {
    gameState.gamePaused = !gameState.gamePaused;
    pauseBtn.textContent = gameState.gamePaused ? '继续' : '暂停';
    pauseBtn.classList.toggle('paused', gameState.gamePaused);
    
    if (!gameState.gamePaused) {
        gameLoop(); // 恢复游戏时重新启动循环
    }
}

// 游戏结束
function gameOver() {
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    clearTimeout(gameState.gameLoopId);
    pauseBtn.textContent = '暂停';
    pauseBtn.classList.remove('paused');
    alert(`游戏结束，最终得分：${gameState.score}`);
    initGame();
}

// 事件监听
pauseBtn.addEventListener('click', togglePause);

document.addEventListener('keydown', (event) => {
    // 空格键暂停
    if (event.code === 'Space') {
        event.preventDefault();
        togglePause();
    }
    
    if (gameState.gamePaused || !gameState.gameRunning) return;
    
    switch (event.code) {
        case 'KeyW':
            if (gameState.dy === 0) {
                gameState.dx = 0;
                gameState.dy = -config.grid;
            }
            break;
        case 'KeyS':
            if (gameState.dy === 0) {
                gameState.dx = 0;
                gameState.dy = config.grid;
            }
            break;
        case 'KeyA':
            if (gameState.dx === 0) {
                gameState.dx = -config.grid;
                gameState.dy = 0;
            }
            break;
        case 'KeyD':
            if (gameState.dx === 0) {
                gameState.dx = config.grid;
                gameState.dy = 0;
            }
            break;
    }
});

// 启动游戏
initGame();