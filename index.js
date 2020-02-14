const util = require("util");
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let notes = [];
// this sets up for body parsing and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));
//creating class to export to the db.json file
class Notepad {
  constructor() {
    this.lastid = 0;
  }
  read() {
    // reads the notes from json file
    return readFileAsync("./Develop/db/db.json", "utf8");
  }
  write(note) {
    // make it stringify so you can write it to the file
    return writeFileAsync("./Develop/db/db.json", JSON.stringify(note));
  }
  async getNotes() {
    const notes = await this.read();
    let parseNotes;
    try {
          // making notes an array of objects

      parseNotes = [].concat(JSON.parse(notes));
    }
    catch (error) {
      parseNotes = [];
    }
    return parseNotes;

  }

  async addNote(note) {
    const { title, text } = note
    if (!title || !text) {
      throw new Error("Input Error, no text!")
    }
    const newNote = { title, text, id: ++this.lastid }
    const notes = await this.getNotes();
    const updatedNotes = [...notes, newNote];

    //using a promise to update the old note to the newNote

    await this.write(updatedNotes);
    return newNote;
  }
  // delete the old note from the array on note objects

  async removeNote(id) {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== parseInt(id));
    return await this.write(filteredNotes);
  }
};

app.get("/api/notes", function (err, res) {

  try {
    //reading file
    notes = fs.readFileSync("Develop/db/db.json", "utf8");

    // making notes an array of objects

    notes = JSON.parse(notes);

    // catches the error and logs it in the console

  }
  catch (err) {

    console.log("\n error (in app.get.catch):");
    console.log(err);

  }
  // this sends the object to the web browser
  res.json(notes);
});

// writes the new note to the json file
app.post("/api/notes", function (req, res) {

  try {

    //reading file
    notes = fs.readFileSync("Develop/db/db.json", "utf8");

    console.log(notes);

    // making notes an array of objects
    notes = JSON.parse(notes);
    // Setting the new notes to an id
    req.body.id = notes.length;

    // adding the new note to the array of objects "notes"
    // this pushes the user input (body) to the notes

    notes.push(req.body);
    notes = JSON.stringify(notes);


    fs.writeFile("Develop/db/db.json", notes, "utf8", function (err) {
      // stops running the file on an error
      if (err) throw err;
    });

    // makes and sends the new array back to the web browser

    res.json(JSON.parse(notes));

    // catches the error and stops running the application
  } catch (err) {
    throw err;
  }
});

app.delete("/api/notes/:id", function (req, res) {
  try {
    //  reads the json file
    notes = fs.readFileSync("Develop/db/db.json", "utf8");
    // making notes an array of objects

    notes = JSON.parse(notes);

    notes = notes.filter(function (note) {
      return note.id != req.params.id;
    });
    notes = JSON.stringify(notes);
    // write the new notes to the file
    fs.writeFile("Develop/db/db.json", notes, "utf8", function (err) {

      if (err) throw err;
    });

    // makes and sends the new array back to the web browser
    res.send(JSON.parse(notes));
  } catch (err) {
    throw err;
  }
});

// Website functionality

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});
app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
});
app.listen(PORT, function () {
  console.log("Im listening !!");
});

module.exports = new Notepad()
