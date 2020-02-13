const util = require("util");
const fs = require("fs");




const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Notepad {
    constructor() {
        this.lastid = 0;
    }
    read() {
        return readFileAsync("db/db.json", "utf8")
    }
    write(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note) )
    }
    getNotes() {
        return this.read () 
        .then(notes => {
            let parseNotes; 
            try {
                parseNotes = [].concat(JSON.parse(notes))
            } catch (error) {
                parseNotes = []
            }
            return parseNotes
        })

    }

    addNote(note) {
        const {title, text} = note
        if (!title || !text) {
            throw new Error ("Input Error, no text!")
        }
        const newNote = {title, text, id : ++ this.lastid}
    return this.getNotes() .then(notes => [...notes, newNote ]) 
        .then(updatedNotes => this.write(updatedNotes))
        .then(()=> newNote)
    }

    removeNote(id) {
        return this.getNotes() 
        .then(notes => notes.filter(note => note.id !== parseInt(id)))
        .then(filteredNotes => this.write(filteredNotes))
    }
}

module.exports = new Notepad()
