/*
  Warnings:

  - Added the required column `colors` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flags` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoist` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentionable` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "colors" JSONB NOT NULL,
    "flags" JSONB NOT NULL,
    "hoist" BOOLEAN NOT NULL,
    "mentionable" BOOLEAN NOT NULL,
    "permissions" JSONB NOT NULL,
    "position" INTEGER NOT NULL,
    "guildId" INTEGER NOT NULL,
    CONSTRAINT "Role_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Role" ("externalId", "guildId", "id", "name", "permissions") SELECT "externalId", "guildId", "id", "name", "permissions" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
CREATE UNIQUE INDEX "Role_externalId_key" ON "Role"("externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
