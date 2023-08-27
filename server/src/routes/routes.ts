import express from "express";
import * as db from "../database/db";
import { User } from "../model/models";
const router = express.Router();

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized." });
}

router.use(ensureAuthenticated);

router.get("/getLists", async (req, res) => {
  const authenticatedUserId = (req.user as User).userId;

  try {
    const lists = await db.getLists(authenticatedUserId);

    const listsWithEntries = await Promise.all(
      lists.map(async (list) => {
        const entry = await db.getEntry(list.listId);
        return { ...list, entry };
      })
    );

    res.json(listsWithEntries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

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

router.post("/createNewList", async (req, res) => {
  const authenticatedUserId = (req.user as User).userId;
  try {
    const result = await db.createNewList(authenticatedUserId);
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

export default router;
