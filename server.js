// server.js

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to SQLite database
const dbPath = path.resolve("mjolnir_app.db");

const db = new sqlite3.Database(dbPath);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  db.all("SELECT * FROM questions", (err, questions) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { questions});
    }
  });
});

app.post('/submit', (req, res) => {
  const answers = req.body;
  let score = 0;
  const correctAnswers = ['Thor Odinson', 'Loki', 'Mjolnir', 'Captain America', 'Eitri']; // Assuming answers are stored in an array

  for (let i = 0; i < correctAnswers.length; i++) {
    if (answers[`question${i + 1}`] === correctAnswers[i]) {
      score++;
    }
  }

  const isWorthy = score >= 4;

  db.run("INSERT INTO users (username, score, is_worthy) VALUES (?, ?, ?)", [req.body.username, score, isWorthy], (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/leaderboard');
    }
  });
});

app.get('/leaderboard', (req, res) => {
  db.all("SELECT * FROM users WHERE is_worthy = 1 ORDER BY score DESC LIMIT 5", (err, worthyUsers) => {
    if (err) {
      console.log(err);
    } else {
      res.render('leaderboard', { worthyUsers });
    }
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

