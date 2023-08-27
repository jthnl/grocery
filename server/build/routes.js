"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./database/db"));
const joi_1 = require("./model/joi");
const router = express_1.default.Router();
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized.' });
}
router.use(ensureAuthenticated);
router.get('/getLists', ensureAuthenticated, async (req, res) => {
    const authenticatedUserId = req.user.userId; // Authenticated user's userId
    try {
        const lists = await (0, db_1.default)('List').where('userId', authenticatedUserId).andWhere('active', true);
        const listsWithEntries = await Promise.all(lists.map(async (list) => {
            const entry = await (0, db_1.default)('Entry')
                .where('listId', list.listId)
                .andWhere('version', list.latestVersion)
                .first();
            return { ...list, entry };
        }));
        res.json(listsWithEntries);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/getEntry', async (req, res) => {
    console.log("TETS");
    const { entryId } = req.body;
    try {
        const entry = await (0, db_1.default)('Entry').where('entryId', entryId).first();
        res.json(entry);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/getEntryHistory', async (req, res) => {
    const { listId } = req.body;
    try {
        const entryHistory = await (0, db_1.default)('Entry')
            .where('listId', listId)
            .orderBy('version', 'desc');
        res.json(entryHistory);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/updateList', async (req, res) => {
    const { oldEntry, newData } = req.body;
    try {
        // Fetch the existing entry from the database
        const existingEntry = await (0, db_1.default)('Entry').where('entryId', oldEntry.entryId).first();
        // Compare the existing data with the new data
        if (JSON.stringify(existingEntry.data) === JSON.stringify(newData)) {
            return res.json({ message: 'Data is unchanged. No updates needed.' });
        }
        // Validate the new data using Joi
        const validationError = (0, joi_1.validateGroceryList)(newData);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        // Start a transaction to ensure data consistency
        await db_1.default.transaction(async (trx) => {
            // Create a new entry with updated data
            const newEntry = {
                listId: existingEntry.listId,
                version: existingEntry.version + 1,
                data: newData,
                date: new Date(),
            };
            // Insert the new entry into the database
            await trx('Entry').insert(newEntry);
            // Update the latestVersion field of the associated list
            await trx('List')
                .where('listId', existingEntry.listId)
                .update('latestVersion', newEntry.version);
            res.json({ success: true });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/createNewList', async (req, res) => {
    const authenticatedUserId = req.user.userId; // Authenticated user's userId
    try {
        // Start a transaction to ensure data consistency
        await db_1.default.transaction(async (trx) => {
            // Create a new list
            const newList = {
                userId: authenticatedUserId,
                active: true,
                latestVersion: 1
            };
            // Insert the new list into the database
            const [insertedList] = await trx('List').insert(newList).returning('*');
            // Create a new entry for the list with version and latestVersion = 1
            const newEntry = {
                listId: insertedList.listId,
                version: 1,
                data: {},
                date: new Date(),
            };
            // Insert the new entry into the database
            await trx('Entry').insert(newEntry);
            // Update the latestVersion field of the inserted list
            await trx('List')
                .where('listId', insertedList.listId)
                .update('latestVersion', 1);
            res.json(insertedList);
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map