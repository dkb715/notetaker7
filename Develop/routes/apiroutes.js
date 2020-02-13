const router = require("express").Router()
const Notepad = require("../db/index")


router.get ("/notes", function(req, res){
    Notepad.getNotes() 
    .then(notes => res.json(notes))
    .catch(err => res.status(500) .json(err))
})

