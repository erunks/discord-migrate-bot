-- CreateTable
CREATE TABLE "Guild" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "externalId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_externalId_key" ON "Guild"("externalId");
