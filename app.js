const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const bodyParser = require('body-parser'); // Added bodyParser for parsing JSON data

// Create a MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '7460',
  database: 'coin_tracker'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

app.use(bodyParser.json()); // Use bodyParser to parse JSON data

// Add a new coin to the database
// Add a new coin to the database
// Add a new coin to the database
app.post('/add-coin', (req, res) => {
    const { coinName, coinPrice } = req.body;
  
    // Insert the coin into the database
    const sql = 'INSERT INTO coins (coinName, coinPrice) VALUES (?, ?)';
    db.query(sql, [coinName, coinPrice], (err, result) => {
      if (err) {
        console.error('Error adding coin: ' + err.message);
        res.status(500).json({ error: 'Error adding coin' });
      } else {
        const timestamp = new Date().toLocaleString(); // Get the current timestamp
        const message = `Coin added - ${coinName} - ${coinPrice} at ${timestamp}`;
        io.emit('new-coin', message); // Emit a message to notify clients of the new coin
        res.json({ message: 'Coin added successfully' });
      }
    });
  });
  
// Serve SSE to the client
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Set up a periodic event to send data to the client
  const interval = setInterval(() => {
    // Fetch the latest coin data from the database
    const sql = 'SELECT * FROM coins';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching coins: ' + err.message);
        clearInterval(interval);
        res.status(500).json({ error: 'Error fetching coins' });
      } else {
        // Send the coin data to the client
        res.write(`data: ${JSON.stringify(results)}\n\n`);
      }
    });
  }, 5000); // Update every 5 seconds

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Start the Express server
// const PORT = process.env.PORT || 3000;
// http.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });//