document.addEventListener('DOMContentLoaded', async (event) => {
    const instructionContainer = document.getElementById('instructionContainer');
    const startButton = document.getElementById('startButton');
    const gameContainer = document.getElementById('gameContainer');
    const scoreNumber = document.getElementById('scoreNumber');
    const timerDisplay = document.getElementById('timerNumber');
    const endingDark = document.getElementById('endingDark');
    const endingPopup = document.getElementById('endingPopup');
    const endingScore = document.getElementById('endingScore');
    const retryButton = document.getElementById('retry');
    const nameInput = document.getElementById('nameinput');
    const rankingTableBody = document.querySelector('#rankingTable tbody');

    let score = 0;
    let timeLeft = 10;
    let gameInterval;
    let fruitInterval;
    let playerName = "";
    let rankings = [];

    async function fetchRankings() {
        try {
            const response = await fetch('http://localhost:3000/rankings');
            return await response.json();
        } catch (error) {
            console.error('Error fetching rankings:', error);
            return Array(5).fill({ name: '-', score: 0 });
        }
    }

    async function submitScore(name, score) {
        try {
            const response = await fetch('http://localhost:3000/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, score }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error submitting score:', error);
            return [];
        }
    }

    async function updateRankings() {
        console.log('Current Rankings:', rankings);
        console.log('New Score:', { name: playerName, score: score });

        const updatedRankings = await submitScore(playerName, score);

        rankingTableBody.innerHTML = '';
        updatedRankings.forEach((ranking, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${ranking.name}</td><td>${ranking.score}</td>`;
            rankingTableBody.appendChild(row);
        });

        console.log('Updated Rankings:', updatedRankings);
    }

    function startGame() {
        instructionContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        score = 0;
        timeLeft = 10;
        playerName = nameInput.value.trim() || 'Anonymous';
        scoreNumber.textContent = '0';
        timerDisplay.textContent = '60s';
        gameInterval = setInterval(updateTimer, 1000);
        fruitInterval = setInterval(createFruit, 450);
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(fruitInterval);
        endingDark.style.display = 'block';
        endingPopup.style.display = 'block';
        console.log('Game ended. Updating rankings...');
        updateRankings();
    }

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
        const spawnAreaWidth = containerWidth * 0.85;
        const spawnOffset = (containerWidth - spawnAreaWidth) / 2;
        fruit.style.left = Math.floor(Math.random() * (spawnAreaWidth - 100)) + spawnOffset + 'px';

        gameContainer.appendChild(fruit);

        fruit.addEventListener('animationend', () => {
            fruit.remove();
        });
    }

    function updateScore() {
        scoreNumber.textContent = `${score}`;
        endingScore.textContent = `${score}`;
    }

    function updateTimer() {
        timerDisplay.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            endGame();
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

    startButton.addEventListener('click', startGame);
    retryButton.addEventListener('click', () => {
        endingDark.style.display = 'none';
        endingPopup.style.display = 'none';
        startGame();
    });

    // Initial call to update ranking table with any existing data
    rankings = await fetchRankings();
    rankingTableBody.innerHTML = '';
    rankings.forEach((ranking, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${ranking.name}</td><td>${ranking.score}</td>`;
        rankingTableBody.appendChild(row);
    });
});
