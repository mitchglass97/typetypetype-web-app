// Main logic for server (back-end).
// There are routes for:
// 1) POST a new leaderboard score to PostgreSQL database
// 2) GET all leaderboard scores to PostgreSQL database
// 3) a catch-all route that serves the index.html page

const express = require("express");
const path = require('path');
const app = express(); 
const cors = require("cors");
const pool = require("./db"); // grab the Pool code from db.js so we can query the PostgreSQL database

// middleware 
app.use(cors()); // enables CORS on our web server
app.use(express.json()); // this gives us access to request.body and request.parameters 

// if on heroku
if(process.env.NODE_ENV === 'production') {
    console.log('heroku production detected');
    app.use(express.static('../client/build'));
}

// Start server by listening on a designated port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("CORS-enabled web server listening on port " + port);
});

//ROUTES

// POST a new leaderboard score
app.post("/leaderboard", async(req,res) => {
    try {
        // extract attributes from JSON request body
        const {user_name, WPM, accuracy} = req.body;
        // query to insert a new row into table 
        const newScore = await pool.query(
            "INSERT INTO typeTable(user_name, WPM, accuracy, posting_date) VALUES($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *", 
            [user_name, WPM, accuracy]);
        res.json(newScore.rows[0]); 
    } catch (error) {
        console.error(err.message);
    }
});

// GET all leaderboard scores
app.get("/api/leaderboard", async(req,res) => {
    try {
        const allScores = await pool.query(
            "SELECT * FROM typeTable ORDER BY posting_date desc;");
        res.json(allScores.rows); 
    } catch (error) {
        console.error(err.message);
    }
});

// CATCH-ALL. This is a fix needed due to how React Routing works. Without this,
// if you viit https://typetypetype-webapp.herokuapp.com/leaderboard
// without having first been on the home page, the page does not load correctly
// since browser would not have any of the React or Javascript loaded.
app.get('*', function (req, res) {
    res.sendFile(path.resolve('/app/client/build/index.html'));
  });