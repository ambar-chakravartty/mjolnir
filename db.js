const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Database file path
const dbPath = './mjolnir_app.db';

// Read SQL script files
const createDatabaseScript = fs.readFileSync('./create_database.sql', 'utf-8');
const createTablesScript = fs.readFileSync('./create_tables.sql', 'utf-8');
const populateQuestionsScript = fs.readFileSync('./populate_questions.sql', 'utf-8');

// Create database and tables
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Execute create database script
  db.exec(createDatabaseScript, (err) => {
    if (err) console.error('Error creating database:', err.message);
    else console.log('Database created successfully');
  });

  // Execute create tables script
  db.exec(createTablesScript, (err) => {
    if (err) console.error('Error creating tables:', err.message);
    else console.log('Tables created successfully');
  });

  // Execute populate questions script
  db.exec(populateQuestionsScript, (err) => {
    if (err) console.error('Error populating questions:', err.message);
    else console.log('Questions populated successfully');
  });
});

// Close the database connection
db.close();

