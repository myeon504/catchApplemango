const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

let rankings = Array(5).fill({ name: '-', score: 0 });

app.use(cors());
app.use(bodyParser.json());

app.get('/rankings', (req, res) => {
    res.json(rankings);
});

app.post('/submit-score', (req, res) => {
    const { name, score } = req.body;
    rankings.push({ name, score });
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 5);
    res.json(rankings);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
