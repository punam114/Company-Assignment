const Note = require("../model/notesModel");

// CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY NOTES
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE NOTE
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!note) return res.status(403).json({ msg: "Not allowed" });

    Object.assign(note, req.body);
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE NOTE
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};