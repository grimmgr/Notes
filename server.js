const express = require('express');
const path = require('path');
const fs = require('fs');
// const util = require('util');

const notesData = require('./db/db.json');

const app = express();

// const readFileAsync = util.promisify(fs.readFile);
// const writeFileAsync = util.promisify(fs.writeFile);

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// html routes

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


// api routes

app.get('/api/notes', (req, res) => {
    res.json(notesData);
});

app.post('/api/notes', (req, res) => {
    notesData.push(req.body);

    fs.writeFile('db/db.json', JSON.stringify(notesData), function(err) {
        if (err) {
          return console.log(err);
        }
    });

    res.json(req.body);
});

app.delete('/api/notes/:id', (req, res) => {
    const paramId = req.params.id;
    
    notesData.forEach((note) => {
        if (note.id === paramId) {
            const noteIndex = notesData.indexOf(note);
            notesData.splice(noteIndex, 1);
        }
    });

    fs.writeFile('db/db.json', JSON.stringify(notesData), function(err) {
        if (err) {
          return console.log(err);
        }
    });
    
    res.json(notesData);
}); 
   


app.listen(PORT, function() {
    console.log('App listening on PORT: ' + PORT);
});
  