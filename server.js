const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");
// setting port for listening
const PORT = process.env.PORT || 3001;

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("public"));

// creating route to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// creating route to notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// receive and save new note on the request body then add it to db.json and respond the new note to client
app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteLength = noteList.length.toString();

  newNote.id = noteLength;
  noteList.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  res.json(noteList);
});

// display saved and new notes on the left side of the page
app.get("/api/notes", (req, res) => {
  let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(noteList);
});

// deleting the notes based on the id that are related
app.delete("/api/notes/:id", (req, res) => {
  let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteId = req.params.id.toString();

  noteList = noteList.filter((selected) => {
    return selected.id != noteId;
  });
  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  res.json(noteList);
});

// listening to the port after deployed
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
