/*
  Warnings:

  - Added the required column `externalId` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissions` to the `ChannelRole` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "flags" JSONB NOT NULL,
    "guildId" INTEGER NOT NULL,
    CONSTRAINT "Channel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("flags", "guildId", "id", "name", "permissions", "type") SELECT "flags", "guildId", "id", "name", "permissions", "type" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_externalId_key" ON "Channel"("externalId");
CREATE TABLE "new_ChannelRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channelId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissions" JSONB NOT NULL,
    CONSTRAINT "ChannelRole_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChannelRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChannelRole" ("channelId", "id", "roleId") SELECT "channelId", "id", "roleId" FROM "ChannelRole";
DROP TABLE "ChannelRole";
ALTER TABLE "new_ChannelRole" RENAME TO "ChannelRole";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
