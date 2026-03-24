import express from "express";
import Note from "../models/Note";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const newNote = new Note({ title, content });
    await newNote.save();

    res.json({ message: "Note saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving note" });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error fetching note" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;