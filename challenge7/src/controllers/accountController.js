const { PrismaClient } = require('@prisma/client');
const { accountSchema } = require('@validators/accountValidator');

const prisma = new PrismaClient();
const response = require('@utils/response');

const addAccountToUser = async (req, res) => {
  const userId = req.params.userid;
  const accountData = req.body;

  const { error } = accountSchema.validate(accountData);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingUser = await prisma.customer.findUnique({
      where: { customer_id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      return response.res404(res, 'User not found');
    }

    const newAccount = await prisma.account.create({
      data: {
        ...accountData,
        customer: {
          connect: {
            customer_id: existingUser.customer_id,
          },
        },
      },
    });

    return response.res200(res, newAccount);
  } catch (err) {
    console.error('Error adding account to user:', err);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const getAccountsByUser = async (req, res) => {
  const userId = req.params.userid;

  try {
    const existingUser = await prisma.customer.findUnique({
      where: { customer_id: parseInt(userId, 10) },
      include: {
        account: {
          select: {
            account_id: true,
            account_number: true,
            balance: true,
            account_type: true,
            created_at: true,
            updated_at: true,
            is_delete: true,
            status: true,
          },
        },
      },
    });

    if (!existingUser) {
      return response.res404(res, 'User not found');
    }

    const userAccounts = existingUser.account;

    return response.res200(res, userAccounts);
  } catch (err) {
    console.error('Error getting user accounts:', err);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage, 10) || 10;

    const offset = (page - 1) * itemsPerPage;

    const accounts = await prisma.account.findMany({
      take: itemsPerPage,
      skip: offset,
    });

    if (accounts.length <= 0) {
      return response.res404(res, 'Account not found');
    }

    return response.res200(res, accounts);
  } catch (error) {
    console.error('Error getting accounts:', error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getAllAccounts, addAccountToUser, getAccountsByUser,
};
