import express from "express";
import Note from "../models/Note";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      keystrokes: req.body.keystrokes || 0,
      pastes: req.body.pastes || 0,
      user: req.user.id 
    });

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Error saving note" });
  }
});

router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Fetch All Error:", err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

router.get("/:id", authMiddleware, async (req: any, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error fetching note" });
  }
});

router.put("/:id", authMiddleware, async (req: any, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: req.body.title,
        content: req.body.content,
        keystrokes: req.body.keystrokes,
        pastes: req.body.pastes
      },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
});

router.delete("/:id", authMiddleware, async (req: any, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

export default router;