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
    // Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
    let notesArray = [];
    try {
        const notes = fs.readFileSync('./db/db.json');
        notesArray = JSON.parse(notes);
        notesArray.push(req.body);
    

        const notesString = JSON.stringify(notesArray);

        fs.writeFileSync('./db/db.json', notesString);
        
        res.json(req.body);

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
                console.log(notesArray);
            }
        }
    } catch (err) {
        console.log(err);
        res.send('error');
    }

    const notesString = JSON.stringify(notesArray);

    fs.writeFileSync('./db/db.json', notesString);  
    // Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file
});

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("Server listening on PORT " + PORT);
});