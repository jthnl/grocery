import express from 'express';
import cors from 'cors'; 
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import routes from './routes/routes';
import passport from './middleware/passportConfig';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const sessionSecret = crypto.randomBytes(32).toString('hex');
const app = express();

// cors
app.use(cors({ credentials: true, }));

// middlewares
app.use(express.json());
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', authRoutes);
app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

