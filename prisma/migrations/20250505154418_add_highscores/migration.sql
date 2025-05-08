-- CreateTable
CREATE TABLE "Highscore" (
    "id" SERIAL NOT NULL,
    "game" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Highscore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Highscore_userId_game_key" ON "Highscore"("userId", "game");

-- AddForeignKey
ALTER TABLE "Highscore" ADD CONSTRAINT "Highscore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
