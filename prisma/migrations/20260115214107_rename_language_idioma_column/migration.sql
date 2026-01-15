/*
  Warnings:

  - You are about to drop the column `name` on the `languages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "languages" DROP COLUMN "name",
ADD COLUMN     "idioma" VARCHAR(100);
