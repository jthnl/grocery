"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const routes_1 = __importDefault(require("./routes/routes"));
const passportConfig_1 = __importDefault(require("./middleware/passportConfig"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sessionSecret = crypto_1.default.randomBytes(32).toString('hex');
const app = (0, express_1.default)();
// cors
app.use((0, cors_1.default)({ origin: process.env.FRONT_END, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", credentials: true, }));
// middlewares
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: sessionSecret, resave: false, saveUninitialized: false }));
app.use(passportConfig_1.default.initialize());
app.use(passportConfig_1.default.session());
// routes
app.use('/', authRoutes_1.default);
app.use('/', routes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
//# sourceMappingURL=server.js.map