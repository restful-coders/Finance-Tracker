const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


const app = express();
const port = 7000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory data store (replace with a database in production)
const users = [];

// Nodemailer setup (replace with your own email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vaibhavvpatill@gmail.com',
    pass: 'soaxtqhmadvcrfsn',
  },
});

// Endpoint to handle user registration
app.post('/signup', (req, res) => {
    const { Email } = req.body;
  
    // Check if the email is already registered
    if (users.some((user) => user.Email === Email)) {
      return res.status(400).send('Email is already registered');
    }
  
    // Generate a random OTP
    const otp = randomstring.generate({ length: 6, charset: 'numeric' });
  
    // Save user data to the in-memory data store
    const user = { Email, otp };
    users.push(user);
  
    // Send OTP via email
    sendOTP(Email, otp);
  
    // Send a response to the client
    res.status(200).json({ message: 'OTP sent successfully!' });
  });
  


// Send OTP via email
function sendOTP(Email, otp) {
  const mailOptions = {
    from: 'vaibhavvpatill@gmail.com',
    to: Email,
    subject: 'Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Endpoint to handle user registration
app.post('/signup', (req, res) => {
  const { Email } = req.body;

  // Check if the email is already registered
  if (users.some((user) => user.Email === Email)) {
    return res.status(400).send('Email is already registered');
  }

  // Generate a random OTP
  const otp = randomstring.generate({ length: 6, charset: 'numeric' });

  // Save user data to the in-memory data store
  const user = { Email, otp };
  users.push(user);

  // Send OTP via emai  l
  sendOTP(Email, otp);

  res.status(200).send('Otp Send To Email Address');
});

// Endpoint to handle OTP verification
app.post('/veriify', (req, res) => {
  const { Email, enteredOTP } = req.body;

  // Find the user by email
  const user = users.find((u) => u.email === Email);

  // Check if the entered OTP is correct
  if (user && user.otp === enteredOTP) {
    return res.send('Verification successful!');
  }

  res.status(400).send('Invalid OTP');
});
// MySQL database connection    
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username (default is 'root' for XAMPP)
    password: '', // Your MySQL password (default is empty for XAMPP)
    database: 'web'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

// Define routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database for user authentication
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            // User authenticated
            res.sendFile(__dirname + '/public/user_home.html'); // Send the user_home.php file as a response
        } else {
            // Invalid credentials
            res.status(401).send('Invalid username or password');
        }
    });
});
app.post('/signup', (req, res, ) => {
    const { username, password, Email } = req.body;

    // Insert new user into the database
    db.query('INSERT INTO users (username, password, Email) VALUES (?, ?, ?)', [username, password, Email], (err) => {
        if (err) {
            console.error('Error inserting into database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.redirect('./public/home.html');
    });
});


app.post('/addIncome', (req, res) => {
    const { incomeSource, amount, frequency, date, description } = req.body;

    // Insert data into MySQL
    const query = `INSERT INTO income (incomeSource, amount, frequency, date, description) VALUES (?, ?, ?, ?, ?)`;
    const values = [incomeSource, amount, frequency, date, description];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted into MySQL:', results);
            res.status(200).send('Data added successfully!');
        }
    });
});
app.post('/addExpense', (req, res) => {
    const { expenseCategory, amount, paymentMethod, date, description } = req.body;

    // Insert data into MySQL
    const query = `INSERT INTO expenses (expenseCategory, amount, paymentMethod, date, description) VALUES (?, ?, ?, ?, ?)`;
    const values = [expenseCategory, amount, paymentMethod, date, description];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted into MySQL:', results);
            res.status(200).send('Data added successfully!');
        }
    });
});

app.post('/addBudget', (req, res) => {
    const { monthlyBudget, savingsAmount, budgetCategory, budgetNotes, paymentDate } = req.body;

    // Insert data into MySQL
    const query = `INSERT INTO budget (monthlyBudget, savingsAmount, budgetCategory, budgetNotes, paymentDate) VALUES (?, ?, ?, ?, ?)`;
    const values = [monthlyBudget, savingsAmount, budgetCategory, budgetNotes, paymentDate];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted into MySQL:', results);
            res.status(200).send('Budget added successfully!');
        }
    });
});
app.get('/reminder', (req, res) => {
    res.sendFile(__dirname + '/reminder.html');
});

// Route to handle POST request to add a new reminder
app.post('/addReminder', (req, res) => {
    const { reminderType, amount, dueDate, priority, notes } = req.body;

    // Insert data into MySQL
    const query = 'INSERT INTO reminders (reminderType, amount, dueDate, priority, notes) VALUES (?, ?, ?, ?, ?)';
    const values = [reminderType, amount, dueDate, priority, notes];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted into MySQL:', results);
            res.status(200).send('Reminder added successfully!');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
});




