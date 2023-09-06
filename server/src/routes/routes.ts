// Dashboard Application APIs
import express from "express";
import * as db from "../database/db";
import { User } from "../model/models";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// checks that all application routes are authenticated
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false }, (err: Error, user: any, info: any) => {
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
router.get("/getListEntries", async (req, res) => {
  const authenticatedUserId = (req.user as User).userId;
  try {
    const lists = await db.getLists(authenticatedUserId);
    const entries = await Promise.all(
      lists.map(async (list) => {
        const entry = await db.getLatestEntry(list);
        return entry;
      })
    );

    res.json(entries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// get a specific entry
router.post("/getEntry", async (req, res) => {
  const { entryId } = req.body;
  try {
    const entry = await db.getEntry(entryId);
    res.json(entry);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// get a list of entries that represent the list's change history
router.post("/getEntryHistory", async (req, res) => {
  const { listId } = req.body;
  try {
    const entryHistory = await db.getEntryHistory(listId);
    res.json(entryHistory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// add a new version entry and update the list
router.post("/updateList", async (req, res) => {
  const { oldEntry, newData } = req.body;
  try {
    const result = await db.updateList(oldEntry, newData);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// creates a new list with a new entry (version 1)
router.post("/createNewList", async (req, res) => {
  const authenticatedUserId = (req.user as User).userId;
  try {
    const result = await db.createNewList(authenticatedUserId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result.error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// set a list active field to false
router.post("/deleteList", async (req, res) => {
  const { listId } = req.body;
  try {
    const result = await db.deleteList(listId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result.error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "An error occurred." });
  }
});

export default router;
