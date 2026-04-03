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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const router = express_1.default.Router();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/google-login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            user = new User_1.default({
                email,
                password: "google-auth-user-" + Math.random().toString(36).slice(-8)
            });
            yield user.save();
        }
        const appToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: appToken });
    }
    catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ message: "Google Authentication failed" });
    }
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User_1.default({ email, password });
        yield newUser.save();
        res.json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
