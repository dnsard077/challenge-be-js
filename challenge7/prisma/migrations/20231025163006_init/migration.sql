-- CreateTable
CREATE TABLE "account" (
    "account_id" SERIAL NOT NULL,
    "account_number" VARCHAR(20),
    "balance" DECIMAL(12,2),
    "account_type" VARCHAR(50),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "is_delete" BOOLEAN,
    "status" VARCHAR(20),
    "customer_id" INTEGER,

    CONSTRAINT "account_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "accountholder" (
    "account_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "is_delete" BOOLEAN,

    CONSTRAINT "accountholder_pkey" PRIMARY KEY ("account_id","customer_id")
);

-- CreateTable
CREATE TABLE "bank" (
    "bank_id" SERIAL NOT NULL,
    "bank_name" VARCHAR(255),
    "head_office_address" TEXT,
    "phone_number" VARCHAR(20),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "is_delete" BOOLEAN,

    CONSTRAINT "bank_pkey" PRIMARY KEY ("bank_id")
);

-- CreateTable
CREATE TABLE "bankbranch" (
    "branch_id" SERIAL NOT NULL,
    "branch_name" VARCHAR(255),
    "branch_address" TEXT,
    "bank_id" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "is_delete" BOOLEAN,

    CONSTRAINT "bankbranch_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" SERIAL NOT NULL,
    "full_name" VARCHAR(255),
    "gender" VARCHAR(10),
    "address" TEXT,
    "phone_number" VARCHAR(20),
    "email" VARCHAR(255),
    "date_of_birth" DATE,
    "identification_number" VARCHAR(20),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "is_delete" BOOLEAN,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "transaction_id" SERIAL NOT NULL,
    "transaction_type" VARCHAR(20),
    "amount" DECIMAL(12,2),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "is_delete" BOOLEAN,
    "account_id" INTEGER,
    "branch_id" INTEGER,
    "from_account_id" INTEGER,
    "to_account_id" INTEGER,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "accountholder" ADD CONSTRAINT "accountholder_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "accountholder" ADD CONSTRAINT "accountholder_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bankbranch" ADD CONSTRAINT "bankbranch_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "bank"("bank_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "bankbranch"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_to_account_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
