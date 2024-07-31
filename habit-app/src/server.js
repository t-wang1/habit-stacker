const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3001; 

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); 

const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "newpassword",
    database: "db",
    port: "3306"
});

con.connect(function(err) {
    if (err) {
        console.error("Error connecting to database: ", err.stack);
        return;
    }
    console.log("Database connected as id " + con.threadId);
    
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS habits (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            new_habit_name VARCHAR(255),
            old_habit_name VARCHAR(255),
            date DATE,
            time VARCHAR(255)
        )
    `;

    con.query(createTableSQL, (err) => {
        if (err) {
            console.error("Error creating table", err);
            return;
        }
        console.log("Table created or already exists");
    });
});

app.post("/submit", (req, res) => {
    const { new_habit_name, old_habit_name, date, time } = req.body;
    console.log("Received data:", req.body);

    const query = 'INSERT INTO habits (new_habit_name, old_habit_name, date, time) VALUES (?, ?, ?, ?)';

    con.query(query, [new_habit_name, old_habit_name, date, time], (error) => {
        if (error) {
            console.error("Database query error", error);
            return res.status(500).send('Error saving the habit');
        }

        exec('python3 predict.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error.message}`);
                return res.status(500).send({ message: 'Error executing Python script', error: error.message });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).send({ message: 'Error in Python script', error: stderr });
            }
            try {
                const result = JSON.parse(stdout);
                console.log('Data parsed successfully:', result);
                res.json(result);
            } catch (parseError) {
                console.error(`Parse error: ${parseError.message}`);
                res.status(500).send({ message: 'Error parsing Python script output', error: parseError.message });
            }
        });
    });
});

app.get('/habits', (req, res) => {
    con.select('*').from('habits')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Database query error:', err);
            res.status(500).send('Error fetching data');
        });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
