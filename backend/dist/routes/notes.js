"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Note_1 = __importDefault(require("../models/Note"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = new Note_1.default({
            title: req.body.title,
            content: req.body.content,
            keystrokes: req.body.keystrokes || 0,
            pastes: req.body.pastes || 0,
            user: req.user.id
        });
        yield note.save();
        res.json(note);
    }
    catch (err) {
        console.error("Create Error:", err);
        res.status(500).json({ message: "Error saving note" });
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield Note_1.default.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    }
    catch (err) {
        console.error("Fetch All Error:", err);
        res.status(500).json({ message: "Error fetching notes" });
    }
}));
router.get("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note_1.default.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        res.json(note);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching note" });
    }
}));
router.put("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, {
            title: req.body.title,
            content: req.body.content,
            keystrokes: req.body.keystrokes,
            pastes: req.body.pastes
        }, { new: true });
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        res.json(note);
    }
    catch (err) {
        res.status(500).json({ message: "Error updating note" });
    }
}));
router.delete("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note_1.default.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        res.json({ message: "Note deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting note" });
    }
}));
exports.default = router;
