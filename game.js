document.addEventListener('DOMContentLoaded', (event) => {
    const instructionContainer = document.getElementById('instructionContainer');
    const startButton = document.getElementById('startButton');
    const gameContainer = document.getElementById('gameContainer');
    const scoreNumber = document.getElementById('scoreNumber');
    const timerDisplay = document.getElementById('timerNumber');
    let score = 0;
    let timeLeft = 60;
    let gameInterval;
    let fruitInterval;

    function startGame() {
        instructionContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        gameInterval = setInterval(updateTimer, 1000);
        fruitInterval = setInterval(createFruit, 450);
    }

    startButton.addEventListener('click', startGame);

    function createFruit() {
        const fruit = document.createElement('div');
        fruit.classList.add('fruit');
        const random = Math.random();
        let fruitType;
        let gifSrc;
        if (random < 0.5) {
            fruitType = 'applemango';
            gifSrc = 'applemango.gif';
        } else if (random < 0.75) {
            fruitType = 'peach';
            gifSrc = 'peach.gif';
        } else {
            fruitType = 'grapefruit';
            gifSrc = 'grapefruit.gif';
        }
        fruit.classList.add(fruitType);

        fruit.style.backgroundImage = `url(${gifSrc}?${new Date().getTime()})`;

        const direction = Math.random() < 0.5 ? '-' : '';
        fruit.style.setProperty('--direction-100px', `${direction}100px`);
        fruit.style.setProperty('--direction-180px', `${direction}180px`);

        const randomHeight = Math.floor(Math.random() * 36) + 40; 
        fruit.style.setProperty('--mid-height', `${randomHeight}vh`);

        const animationDuration = 2 + (randomHeight - 40) / 100; 
        fruit.style.animationDuration = `${animationDuration}s`;

        fruit.addEventListener('click', (event) => {
            let clickedFruit;
            let explosionGifSrc;

            switch (fruitType) {
                case 'applemango':
                    score += 1;
                    clickedFruit = 'applemango';
                    explosionGifSrc = 'applemango_explosion.gif';
                    break;
                case 'peach':
                    score -= 1;
                    clickedFruit = 'peach';
                    explosionGifSrc = 'peach_explosion.gif';
                    break;
                case 'grapefruit':
                    score -= 1;
                    clickedFruit = 'grapefruit';
                    explosionGifSrc = 'grapefruit_explosion.gif';
                    break;
                default:
                    break;
            }

            playExplosionAnimation(event.clientX, event.clientY, explosionGifSrc);
            updateScore();

            fruit.remove();
        });

        const containerWidth = gameContainer.clientWidth;
        const spawnAreaWidth = containerWidth * 0.88;
        const spawnOffset = (containerWidth - spawnAreaWidth) / 2;
        fruit.style.left = Math.floor(Math.random() * (spawnAreaWidth - 100)) + spawnOffset + 'px';

        gameContainer.appendChild(fruit);

        fruit.addEventListener('animationend', () => {
            fruit.remove();
        });
    }

    function updateScore() {
        scoreNumber.textContent = `${score}`;
    }

    function updateTimer() {
        timerDisplay.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            clearInterval(fruitInterval);
            alert(`Time's up! Your score is: ${score}`);
        } else {
            timeLeft -= 1;
        }
    }

    function playExplosionAnimation(x, y, gifSrc) {
        const gifImage = document.createElement('img');
        gifImage.src = `${gifSrc}?${new Date().getTime()}`; 
        gifImage.style.position = 'absolute';
        gifImage.style.width = '250px'; 
        gifImage.style.height = '250px'; 
        gifImage.style.left = `${x - 125}px`;
        gifImage.style.top = `${y - 125}px`;
        document.body.appendChild(gifImage);

        setTimeout(() => {
            gifImage.remove();
        }, 460);
    }
});
