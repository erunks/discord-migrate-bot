/*
  Warnings:

  - Added the required column `position` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalParentId" TEXT,
    "flags" JSONB NOT NULL,
    "position" INTEGER NOT NULL,
    "guildId" INTEGER NOT NULL,
    CONSTRAINT "Channel_externalParentId_fkey" FOREIGN KEY ("externalParentId") REFERENCES "Channel" ("externalId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Channel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("externalId", "flags", "guildId", "id", "name", "type") SELECT "externalId", "flags", "guildId", "id", "name", "type" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_externalId_key" ON "Channel"("externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
