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
exports.deleteList = exports.createNewList = exports.updateList = exports.getEntryHistory = exports.getEntry = exports.getLatestEntry = exports.getLists = exports.registerNewUser = exports.getUserAuthByUserId = exports.getUserByEmail = exports.getUserById = exports.conn = void 0;
// Database Routines
const knex_1 = __importDefault(require("knex"));
const joi_1 = require("../model/joi");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
// configure knex to pgSQL
dotenv_1.default.config();
exports.conn = (0, knex_1.default)({
    client: 'pg',
    connection: {
        connectionString: process.env.DB_URL,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE
    },
});
// User Authentication DB Calls
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.conn)('User').where('userId', userId).first();
    });
}
exports.getUserById = getUserById;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.conn)('User').where('email', email).first();
    });
}
exports.getUserByEmail = getUserByEmail;
function getUserAuthByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.conn)('UserAuth').where('userId', userId).first();
    });
}
exports.getUserAuthByUserId = getUserAuthByUserId;
function registerNewUser(user, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield (0, exports.conn)('User').insert(user);
        const newUserAuth = {
            userId: user.userId,
            passwordHash: hashedPassword,
        };
        yield (0, exports.conn)('UserAuth').insert(newUserAuth);
    });
}
exports.registerNewUser = registerNewUser;
// Dashboard Program DB Calls
function getLists(authenticatedUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.conn)('List').where('userId', authenticatedUserId).andWhere('active', true);
    });
}
exports.getLists = getLists;
function getLatestEntry(list) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.conn)('Entry').where('listId', list.listId).andWhere('version', list.latestVersion).first();
    });
}
exports.getLatestEntry = getLatestEntry;
function getEntry(entryId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.conn)('Entry').where('entryId', entryId).first();
    });
}
exports.getEntry = getEntry;
function getEntryHistory(listId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.conn)('Entry').where('listId', listId).orderBy('version', 'desc');
    });
}
exports.getEntryHistory = getEntryHistory;
function updateList(oldEntry, newData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingEntry = yield (0, exports.conn)('Entry').where('entryId', oldEntry.entryId).first();
            if (JSON.stringify(existingEntry.data) === JSON.stringify(newData)) {
                return { success: false, message: 'Data is unchanged. No updates needed.' };
            }
            const validationError = (0, joi_1.validateGroceryList)(newData);
            if (validationError) {
                return { success: false, error: validationError };
            }
            yield exports.conn.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const newEntry = {
                    listId: existingEntry.listId,
                    version: existingEntry.version + 1,
                    data: newData,
                    date: new Date(),
                };
                yield trx('Entry').insert(newEntry);
                yield trx('List')
                    .where('listId', existingEntry.listId)
                    .update('latestVersion', newEntry.version);
            }));
            return { success: true };
        }
        catch (error) {
            return { success: false, error: 'An error occurred.' };
        }
    });
}
exports.updateList = updateList;
function createNewList(authenticatedUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return exports.conn.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const newList = {
                    userId: authenticatedUserId,
                    active: true,
                    latestVersion: 1,
                };
                const [insertedList] = yield trx('List').insert(newList).returning('*');
                const newEntry = {
                    listId: insertedList.listId,
                    version: 1,
                    data: {},
                    date: new Date(),
                };
                yield trx('Entry').insert(newEntry);
                yield trx('List')
                    .where('listId', insertedList.listId)
                    .update('latestVersion', 1);
                return { success: true };
            }));
        }
        catch (error) {
            console.log(error);
            return { success: false, error: 'An error occurred.' };
        }
    });
}
exports.createNewList = createNewList;
function deleteList(listId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield exports.conn.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                yield trx('List')
                    .where('listId', listId)
                    .update('active', false);
                return { success: true };
            }));
            return result;
        }
        catch (error) {
            console.log(error);
            return { success: false, error: 'An error occurred.' };
        }
    });
}
exports.deleteList = deleteList;
//# sourceMappingURL=db.js.map