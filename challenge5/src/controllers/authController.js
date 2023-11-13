const { PrismaClient } = require('@prisma/client');
const { userSchema } = require('@validators/userValidator');
const { encryptPassword, checkPassword } = require('@utils/helper');
const { JWTsign } = require('@utils/jwt');
const response = require('@utils/response');

const prisma = new PrismaClient();

const register = async (req, res) => {
  const customerData = req.body;
  const { error } = userSchema.validate(customerData);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const hashedPassword = await encryptPassword(customerData.password);
    customerData.password = hashedPassword;
    const customer = await prisma.customer.create({
      data: customerData,
    });
    return response.res201(res, customer);
  } catch (err) {
    if (err.code === 'P2002' && err.meta.target.includes('username')) {
      return response.res400(res, [], 'Someone is already using the username you have chosen. Please try using another one instead.');
    }
    console.error('Error creating customer:', err);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const customer = await prisma.customer.findFirst({
    where: { username },
  });

  if (!customer) {
    return response.res404(res, 'user not found');
  }

  const isPasswordCorrect = await checkPassword(password, customer.password);

  if (!isPasswordCorrect) {
    return response.res401(res, 'wrong password');
  }
  const token = await JWTsign(customer);
  return response.res200(res, { customer, token });
};

module.exports = { login, register };
