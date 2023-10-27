-- AlterTable
ALTER TABLE "account" ALTER COLUMN "is_delete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "accountholder" ALTER COLUMN "is_delete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "bank" ALTER COLUMN "is_delete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "bankbranch" ALTER COLUMN "is_delete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "customer" ALTER COLUMN "is_delete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "is_delete" SET DEFAULT false;
