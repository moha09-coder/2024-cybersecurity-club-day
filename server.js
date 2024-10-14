const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 80;

app.use(bodyParser.json()); // To parse JSON bodies

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/challenges', (req, res) => {
    res.sendFile(__dirname + '/challenges.html');
})


// Load the leaderboard from a local file
let leaderboard = JSON.parse(fs.readFileSync('leaderboard.json', 'utf8'));

const correctAnswers = {
    "Crack that password!!!": { answer: "youwin", challengeNumber: 1 },
    "Robots everywhere": { answer: "robotAnswer", challengeNumber: 2 },
    "Red or blue? Make a choice": { answer: "redpill", challengeNumber: 3 },
    "Phishing??": { answer: "phishingAnswer", challengeNumber: 4 }
};

app.post('/submit-answer', (req, res) => {
    const { challenge, answer, username } = req.body;
    const correctAnswer = correctAnswers[challenge];

    if (correctAnswer && correctAnswer.answer === answer) {
        let player = leaderboard.find(entry => entry.name === username);
        if (player) {
            player.score += 100;
        } else {
            leaderboard.push({ name: username, score: 100 });
        }

        leaderboard.sort((a, b) => b.score - a.score);

        fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard, null, 2));

        res.json({
            message: 'Correct answer! Your score has been updated.',
            correct: true,
            challengeNumber: correctAnswer.challengeNumber
        });
    } else {
        res.json({ message: 'Wrong answer. Try again!', correct: false });
    }
});

app.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
