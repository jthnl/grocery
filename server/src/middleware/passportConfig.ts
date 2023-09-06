import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as db from '../database/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

export async function authenticateUser(username: string, password: string): Promise<string | null> {
  try {
    const user = await db.getUserByEmail(username);
    if (!user) {
      return null; // User not found
    }

    const userAuth = await db.getUserAuthByUserId(user.userId);
    if (!userAuth) {
      return null; // User authentication data not found
    }

    const isPasswordValid = await bcrypt.compare(password, userAuth.passwordHash);
    if (!isPasswordValid) {
      return null; // Incorrect password
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.userId }, jwtSecret, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Choose passport local - JWT token strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await db.getUserById(payload.sub);
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

export default passport;
