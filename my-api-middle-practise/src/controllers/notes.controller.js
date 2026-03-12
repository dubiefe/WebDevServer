// src/controllers/auth.controller.js
import Note from '../models/note.model.js';

// GET api/notes
export const getNotes = async (req, res) => {
    try {
        const user = req.user;
        
        // Get the notes
        const results = await Note.find({owner:user._id});  
        if(!results || results.length === 0) {
            return res.status(404).json({ error: 'No correspondances' });
        }
        return res.json(results);
        
    } catch (err) {
        return res.status(401).json({ error: 'NOT_SESSION' });
    }
}

// POST api/notes
export const createNote = async (req, res) => {
    try {
        const user = req.user;
        
        // Create the note
        const { title, content } = req.body;
        const newNote = await Note.create({ title: title, content: content, owner: user._id });
        return res.status(201).json({message: "Note created", content: newNote});
        
    } catch (err) {
        return res.status(401).json({ error: 'NOT_SESSION' });
    }
}