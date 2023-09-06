"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// User Authentication APIs
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const joi_1 = require("../model/joi");
const db = __importStar(require("../database/db"));
const passportConfig_1 = require("../middleware/passportConfig");
const router = express_1.default.Router();
// passport login user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const token = yield (0, passportConfig_1.authenticateUser)(username, password);
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed.' });
        }
        res.json({ message: 'Logged in successfully.', token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
}));
// passport logout user
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully." });
    });
});
// get user profile
router.get("/profile", (req, res) => {
    const authenticatedUserId = req.user.userId;
    res.json({ userId: authenticatedUserId });
});
// register a new user
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = joi_1.userRegistrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const existingUser = yield db.getUserByEmail(value.email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }
        const newUser = {
            userId: (0, uuid_1.v4)(),
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
        };
        yield db.registerNewUser(newUser, value.password);
        res.json({ message: "User registered successfully." });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map