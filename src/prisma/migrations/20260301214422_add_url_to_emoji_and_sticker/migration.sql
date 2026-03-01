/*
  Warnings:

  - Added the required column `url` to the `Emoji` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Sticker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Emoji" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "animated" BOOLEAN NOT NULL,
    "guildId" INTEGER NOT NULL,
    "base64Data" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "Emoji_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Emoji" ("animated", "base64Data", "externalId", "guildId", "id", "name") SELECT "animated", "base64Data", "externalId", "guildId", "id", "name" FROM "Emoji";
DROP TABLE "Emoji";
ALTER TABLE "new_Emoji" RENAME TO "Emoji";
CREATE UNIQUE INDEX "Emoji_externalId_key" ON "Emoji"("externalId");
CREATE TABLE "new_Sticker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "formatType" INTEGER NOT NULL,
    "base64Data" TEXT NOT NULL,
    "packId" TEXT,
    "partial" BOOLEAN NOT NULL,
    "sortValue" INTEGER NOT NULL,
    "tags" TEXT,
    "type" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    CONSTRAINT "Sticker_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sticker" ("available", "base64Data", "description", "externalId", "formatType", "guildId", "id", "name", "packId", "partial", "sortValue", "tags", "type") SELECT "available", "base64Data", "description", "externalId", "formatType", "guildId", "id", "name", "packId", "partial", "sortValue", "tags", "type" FROM "Sticker";
DROP TABLE "Sticker";
ALTER TABLE "new_Sticker" RENAME TO "Sticker";
CREATE UNIQUE INDEX "Sticker_externalId_key" ON "Sticker"("externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
