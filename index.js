const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 1000;

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Create a new note
app.post('/notes', (req, res) => {
  const { title, datetime, note } = req.body;
  const query = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
  db.query(query, [title, datetime, note], (err, result) => {
    if (err) {
      console.error('Error creating note:', err);
      res.status(500).send('Error creating note.');
      return;
    }
    res.status(201).send('Note created successfully.');
  });
});

// Get all notes
app.get('/notes', (req, res) => {
  const query = 'SELECT * FROM notes';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving notes:', err);
      res.status(500).send('Error retrieving notes.');
      return;
    }
    res.status(200).json(results);
  });
});

// Get a single note by ID
app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM notes WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error retrieving note:', err);
      res.status(500).send('Error retrieving note.');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Note not found.');
      return;
    }
    res.status(200).json(results[0]);
  });
});

// Update a note by ID
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, datetime, note } = req.body;
  const query = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
  db.query(query, [title, datetime, note, id], (err, result) => {
    if (err) {
      console.error('Error updating note:', err);
      res.status(500).send('Error updating note.');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Note not found.');
      return;
    }
    res.status(200).send('Note updated successfully.');
  });
});

// Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting note:', err);
      res.status(500).send('Error deleting note.');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Note not found.');
      return;
    }
    res.status(200).send('Note deleted successfully.');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
