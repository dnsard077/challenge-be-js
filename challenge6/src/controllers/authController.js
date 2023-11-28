const { PrismaClient } = require('@prisma/client');
const { userSchema } = require('@validators/userValidator');
const { encryptPassword, checkPassword } = require('@utils/helper');
const { JWTsign } = require('@utils/jwt');
const response = require('@utils/response');
const fileService = require('@utils/FileService');

const prisma = new PrismaClient();

const register = async (req, res) => {
  const customerData = req.body;
  const { error } = userSchema.validate(customerData);

  if (error) {
    return response.res400(res, { error: error.details[0].message });
  }

  try {
    let imageUrl;
    if (req.file) {
      try {
        imageUrl = await fileService.imgUpload(req.file);
      } catch (uploadError) {
        return response.res400(res, { error: uploadError.message });
      }
    }

    const hashedPassword = await encryptPassword(customerData.password);
    customerData.password = hashedPassword;
    if (imageUrl) {
      customerData.image = imageUrl;
    }

    const customer = await prisma.customer.create({
      data: customerData,
    });

    return response.res201(res, customer);
  } catch (err) {
    // Handle errors appropriately
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
