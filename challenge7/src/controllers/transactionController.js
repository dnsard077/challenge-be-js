const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const response = require('@utils/response');
const { transactionSchema } = require('@validators/transactionValidator');

const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage, 10) || 10;

    const offset = (page - 1) * itemsPerPage;

    const transactions = await prisma.transaction.findMany({
      take: itemsPerPage,
      skip: offset,
    });

    if (transactions.length <= 0) {
      return response.res404(res, 'Transaction not found');
    }
    return response.res200(res, transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const getTransactionDetails = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transactionDetails = await prisma.transaction.findUnique({
      where: { transaction_id: parseInt(transactionId, 10) },
      include: {
        account: {
          select: {
            account_id: true,
            account_number: true,
            customer: {
              select: {
                customer_id: true,
                full_name: true,
                username: true,
              },
            },
          },
        },
        account_transaction_to_account_idToaccount: {
          select: {
            account_id: true,
            account_number: true,
            customer: {
              select: {
                customer_id: true,
                full_name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!transactionDetails || transactionDetails == null) {
      return response.res404(res, 'Transaction not found');
    }

    return response.res200(res, transactionDetails);
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const createTransaction = async (req, res) => {
  const transactionData = req.body;
  const { error } = transactionSchema.validate(transactionData);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let {
    from_account_id, to_account_id, amount, transaction_type, branch_id,
  } = req.body;
  from_account_id = parseInt(from_account_id, 10);
  to_account_id = parseInt(to_account_id, 10);
  try {
    const senderAccount = await prisma.account.findUnique({
      where: { account_id: from_account_id },
    });

    if (!senderAccount) {
      return response.res404(res, 'Sender account not found');
    }

    if (transaction_type === 'Withdrawal') {
      if (senderAccount.balance < amount) {
        return response.res400(res, 'Insufficient balance in the sender account');
      }

      const newTransaction = await prisma.transaction.create({
        data: {
          transaction_type,
          amount: -amount,
          from_account_id,
          to_account_id,
          branch_id,
        },
      });

      await prisma.account.update({
        where: { account_id: from_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return response.res200(res, newTransaction);
    } if (transaction_type === 'Deposit') {
      const newTransaction = await prisma.transaction.create({
        data: {
          transaction_type,
          amount,
          from_account_id,
          to_account_id,
          branch_id,
        },
      });

      await prisma.account.update({
        where: { account_id: from_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return response.res200(res, newTransaction);
    } if (transaction_type === 'Transfer') {
      const receiverAccount = await prisma.account.findUnique({
        where: { account_id: to_account_id },
      });

      if (!receiverAccount) {
        return response.res404(res, 'Receiver account not found');
      }

      if (senderAccount.balance < amount) {
        return response.res400(res, 'Insufficient balance in the sender account');
      }

      const newTransaction = await prisma.transaction.create({
        data: {
          transaction_type,
          amount,
          from_account_id,
          to_account_id,
          branch_id,
        },
      });

      await prisma.account.update({
        where: { account_id: from_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await prisma.account.update({
        where: { account_id: to_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return response.res200(res, newTransaction);
    }
    return response.res400(res, 'Invalid transaction type');
  } catch (err) {
    console.error('Error creating transaction:', err);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { getTransactions, getTransactionDetails, createTransaction };
