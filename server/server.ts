import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import Knex from 'knex';
import db from './database/db';
import { User, UserAuth, List, Entry } from './model/models';
import { GroceryList, userRegistrationSchema } from './model/joi'
import { v4 as uuidv4 } from 'uuid';
import routes from './routes'; // Update the path to match your directory structure


const app = express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// Passport configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    // Fetch the user from the database using email
    db<User>('User')
      .where('email', username)
      .first()
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }
        // Fetch the corresponding user authentication data
        db<UserAuth>('UserAuth')
          .where('userId', user.userId)
          .first()
          .then((userAuth) => {
            if (!userAuth) {
              return done(null, false, { message: 'User authentication data not found.' });
            }
            bcrypt.compare(password, userAuth.passwordHash, (err, result) => {
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
  })
);

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.userId);
});

passport.deserializeUser((id: any, done: (err: any, user?: any) => void) => {
  // Fetch the user from the database using userId
  db<User>('User')
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
app.post('/login', passport.authenticate('local'), (req, res) => {
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
  } else {
    res.status(401).json({ message: 'Unauthorized.' });
  }
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  try {
    // Validate user registration data
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the email is already registered
    const existingUser = await db<User>('User').where('email', value.email).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Insert the new user into the database
    const newUser: User = {
      userId: uuidv4(), // Generate a UUID using version 4
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
    };

    // Insert the new user into the User table
    await db<User>('User').insert(newUser);

    // Insert the new user's authentication data into the UserAuth table
    const newUserAuth: UserAuth = {
      userId: newUser.userId,
      passwordHash: hashedPassword,
    };
    await db<UserAuth>('UserAuth').insert(newUserAuth);

    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred.' });
  }
});


app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

