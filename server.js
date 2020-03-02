// Required node modules
const express = require("express");
const path = require("path");
const fs = require('fs');

// Sets up the Express App
const app = express();
const PORT = 8000;

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    const notes = require('./db/db.json');
    return res.json(notes);
});


app.post("/api/notes", function(req, res) {
    let notesArray = [];
    try {
        const notes = fs.readFileSync('./db/db.json');
        notesArray = JSON.parse(notes);
        notesArray.push(req.body);
    
        const notesString = JSON.stringify(notesArray);

        fs.writeFileSync('./db/db.json', notesString);
        
        res.json(notesArray);

    } catch (err) {
        console.log(err);
        res.send('error');
    }
});

app.delete("/api/notes/:id", function(req, res) {
    const noteId = req.params.id;
    let notesArray = [];
    try {
        const notes = fs.readFileSync('./db/db.json');
        notesArray = JSON.parse(notes);
        for (let i = 0; i < notesArray.length; i++) {
            let note = notesArray[i];
            if (note.id === noteId) {
                notesArray.splice(i, 1);
            }
        }

        const notesString = JSON.stringify(notesArray);

        fs.writeFileSync('./db/db.json', notesString); 

        res.json(notesArray);

    } catch (err) {
        console.log(err);
        res.send('error');
    }
});

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("Server listening on PORT " + PORT);
});