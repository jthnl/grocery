import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import * as db from '../database/db';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByEmail(username);
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }

      const userAuth = await db.getUserAuthByUserId(user.userId);
      if (!userAuth) {
        return done(null, false, { message: 'User authentication data not found.' });
      }

      const result = await bcrypt.compare(password, userAuth.passwordHash);
      if (!result) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
