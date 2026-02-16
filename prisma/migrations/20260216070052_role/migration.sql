-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "guildId" INTEGER NOT NULL,
    CONSTRAINT "Role_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_externalId_key" ON "Role"("externalId");
