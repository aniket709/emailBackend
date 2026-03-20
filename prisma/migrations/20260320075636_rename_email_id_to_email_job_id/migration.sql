/*
  Warnings:

  - You are about to drop the column `emailId` on the `FileUpload` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FileUpload" DROP CONSTRAINT "FileUpload_emailId_fkey";

-- AlterTable
ALTER TABLE "FileUpload" DROP COLUMN "emailId",
ADD COLUMN     "emailJobId" TEXT,
ALTER COLUMN "mimeType" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_emailJobId_fkey" FOREIGN KEY ("emailJobId") REFERENCES "EmailJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
