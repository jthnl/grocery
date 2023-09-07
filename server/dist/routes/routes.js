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
// Dashboard Application APIs
const express_1 = __importDefault(require("express"));
const db = __importStar(require("../database/db"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
// get user profile
router.get("/profile", (req, res) => {
    console.log("profile:", req.user);
    const authenticatedUserId = req.user.userId;
    res.json({ userId: authenticatedUserId });
});
// checks that all application routes are authenticated
function ensureAuthenticated(req, res, next) {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }
        req.user = user;
        return next();
    })(req, res, next);
}
router.use(ensureAuthenticated);
// get all the latest entries for lists owned by user
router.get("/getListEntries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.user.userId;
    try {
        const lists = yield db.getLists(authenticatedUserId);
        const entries = yield Promise.all(lists.map((list) => __awaiter(void 0, void 0, void 0, function* () {
            const entry = yield db.getLatestEntry(list);
            return entry;
        })));
        res.json(entries);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred." });
    }
}));
// get a specific entry
router.post("/getEntry", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { entryId } = req.body;
    try {
        const entry = yield db.getEntry(entryId);
        res.json(entry);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred." });
    }
}));
// get a list of entries that represent the list's change history
router.post("/getEntryHistory", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listId } = req.body;
    try {
        const entryHistory = yield db.getEntryHistory(listId);
        res.json(entryHistory);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred." });
    }
}));
// add a new version entry and update the list
router.post("/updateList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldEntry, newData } = req.body;
    try {
        const result = yield db.updateList(oldEntry, newData);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred." });
    }
}));
// creates a new list with a new entry (version 1)
router.post("/createNewList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.user.userId;
    try {
        const result = yield db.createNewList(authenticatedUserId);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result.error);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred." });
    }
}));
// set a list active field to false
router.post("/deleteList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listId } = req.body;
    try {
        const result = yield db.deleteList(listId);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result.error);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "An error occurred." });
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map