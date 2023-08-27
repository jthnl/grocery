CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Table
CREATE TABLE "User" (
  "userId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "firstName" TEXT,
  "lastName" TEXT,
  "email" TEXT UNIQUE NOT NULL
);

-- UserAuth Table
CREATE TABLE "UserAuth" (
  "userId" UUID PRIMARY KEY REFERENCES "User" ("userId"),
  "passwordHash" TEXT NOT NULL
);

-- Entry Table
CREATE TABLE "Entry" (
  "entryId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "listId" UUID REFERENCES "List" ("listId"),
  "version" INTEGER,
  "data" JSON,
  "date" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- List Table
CREATE TABLE "List" (
  "listId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES "User" ("userId"),
  "latestVersion" INTEGER, -- Reference the latest version's version number
  "active" BOOLEAN
);