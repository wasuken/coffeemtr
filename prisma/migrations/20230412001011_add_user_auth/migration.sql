-- AlterTable
ALTER TABLE "drink_coffee_history" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "drink_coffee_history" ADD CONSTRAINT "drink_coffee_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
