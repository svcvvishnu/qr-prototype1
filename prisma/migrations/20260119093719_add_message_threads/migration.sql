-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "parentMessageId" INTEGER,
ADD COLUMN     "threadId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
