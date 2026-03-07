-- CreateTable
CREATE TABLE "Emoji" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "animated" BOOLEAN NOT NULL,
    "guildId" INTEGER NOT NULL,
    "base64Data" TEXT NOT NULL,
    CONSTRAINT "Emoji_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Emoji_externalId_key" ON "Emoji"("externalId");
