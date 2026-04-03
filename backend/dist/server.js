"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const dns_1 = __importDefault(require("dns"));
const auth_1 = __importDefault(require("./routes/auth"));
const notes_1 = __importDefault(require("./routes/notes"));
dotenv_1.default.config();
dns_1.default.setDefaultResultOrder("ipv4first");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGO_URI, {
    family: 4
})
    .then(() => {
    console.log("MongoDB Connected");
})
    .catch((err) => {
    console.error("Mongo Error:", err);
});
app.use("/api/auth", auth_1.default);
app.use("/api/notes", notes_1.default);
app.get("/", (req, res) => {
    res.send("API is running...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
