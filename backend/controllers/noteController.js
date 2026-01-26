const Note = require('../models/Note');

// Get all notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        const notesWithId = notes.map(note => ({
            ...note.toObject(),
            id: note._id.toString()
        }));
        res.json(notesWithId);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific note by date
exports.getNoteByDate = async (req, res) => {
    try {
        const note = await Note.findOne({ date: req.params.date });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json({ ...note.toObject(), id: note._id.toString() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create or update a note
exports.saveNote = async (req, res) => {
    try {
        let note = await Note.findOne({ date: req.body.date });

        if (note) {
            // Update existing
            note.content = req.body.content;
            note.updatedAt = Date.now();
            const updatedNote = await note.save();
            res.json({ ...updatedNote.toObject(), id: updatedNote._id.toString() });
        } else {
            // Create new
            note = new Note({
                date: req.body.date,
                content: req.body.content,
            });
            const newNote = await note.save();
            res.status(201).json({ ...newNote.toObject(), id: newNote._id.toString() });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOne({ date: req.params.date });
        if (!note) return res.status(404).json({ message: 'Note not found' });

        await note.deleteOne();
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
