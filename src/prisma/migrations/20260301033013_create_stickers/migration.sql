-- CreateTable
CREATE TABLE "Sticker" (
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
    "guildId" INTEGER NOT NULL,
    CONSTRAINT "Sticker_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Sticker_externalId_key" ON "Sticker"("externalId");
