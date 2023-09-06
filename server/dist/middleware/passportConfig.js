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
exports.authenticateUser = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const db = __importStar(require("../database/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};
function authenticateUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db.getUserByEmail(username);
            if (!user) {
                return null; // User not found
            }
            const userAuth = yield db.getUserAuthByUserId(user.userId);
            if (!userAuth) {
                return null; // User authentication data not found
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, userAuth.passwordHash);
            if (!isPasswordValid) {
                return null; // Incorrect password
            }
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user.userId }, jwtSecret, { expiresIn: '1h' });
            return token;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.authenticateUser = authenticateUser;
// Choose passport local - JWT token strategy
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db.getUserById(payload.sub);
        if (!user) {
            return done(null, false, { message: 'User not found.' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
exports.default = passport_1.default;
//# sourceMappingURL=passportConfig.js.map