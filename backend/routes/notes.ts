import express from "express";
import Note from "../models/Note";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// ✅ CREATE NOTE
router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      keystrokes: req.body.keystrokes || 0,
      pastes: req.body.pastes || 0,
      user: req.user.id // Extracts ID from the verified token
    });

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Error saving note" });
  }
});

// ✅ GET ALL NOTES (Only for the logged-in user)
router.get("/", authMiddleware, async (req: any, res) => {
  try {
    // This finds ONLY the notes belonging to YOU
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Fetch All Error:", err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// ✅ GET SINGLE NOTE
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

// ✅ UPDATE NOTE
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

// ✅ DELETE NOTE
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