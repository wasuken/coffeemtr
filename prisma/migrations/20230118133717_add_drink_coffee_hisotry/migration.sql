-- CreateTable
CREATE TABLE "drink_coffee_history" (
    "drink_coffee_history_id" SERIAL NOT NULL,
    "caffeine_contents_mg" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drink_coffee_history_pkey" PRIMARY KEY ("drink_coffee_history_id")
);
