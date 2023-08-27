"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("./database/db"));
const joi_1 = require("./model/joi");
const uuid_1 = require("uuid");
const routes_1 = __importDefault(require("./routes")); // Update the path to match your directory structure
const app = (0, express_1.default)();
const port = 3001;
// middlewares
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Passport configuration
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
    // Fetch the user from the database using email
    (0, db_1.default)('User')
        .where('email', username)
        .first()
        .then((user) => {
        if (!user) {
            return done(null, false, { message: 'User not found.' });
        }
        // Fetch the corresponding user authentication data
        (0, db_1.default)('UserAuth')
            .where('userId', user.userId)
            .first()
            .then((userAuth) => {
            if (!userAuth) {
                return done(null, false, { message: 'User authentication data not found.' });
            }
            bcrypt_1.default.compare(password, userAuth.passwordHash, (err, result) => {
                if (err) {
                    return done(err);
                }
                if (!result) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        })
            .catch((error) => {
            done(error);
        });
    })
        .catch((error) => {
        done(error);
    });
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.userId);
});
passport_1.default.deserializeUser((id, done) => {
    // Fetch the user from the database using userId
    (0, db_1.default)('User')
        .where('userId', id)
        .first()
        .then((user) => {
        done(null, user);
    })
        .catch((error) => {
        done(error);
    });
});
// Routes
app.post('/login', passport_1.default.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in successfully.' });
});
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out successfully.' });
    });
});
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    }
    else {
        res.status(401).json({ message: 'Unauthorized.' });
    }
});
// Route to handle user registration
app.post('/register', async (req, res) => {
    try {
        // Validate user registration data
        const { error, value } = joi_1.userRegistrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        // Check if the email is already registered
        const existingUser = await (0, db_1.default)('User').where('email', value.email).first();
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered.' });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(value.password, 10);
        // Insert the new user into the database
        const newUser = {
            userId: (0, uuid_1.v4)(),
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
        };
        // Insert the new user into the User table
        await (0, db_1.default)('User').insert(newUser);
        // Insert the new user's authentication data into the UserAuth table
        const newUserAuth = {
            userId: newUser.userId,
            passwordHash: hashedPassword,
        };
        await (0, db_1.default)('UserAuth').insert(newUserAuth);
        res.json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
app.use('/', routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map