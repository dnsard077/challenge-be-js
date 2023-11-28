const { PrismaClient } = require('@prisma/client');
const { userSchema } = require('@validators/userValidator');
const { encryptPassword, checkPassword } = require('@utils/helper');
const { JWTsign, generateResetToken, validateResetToken } = require('@utils/jwt');
const response = require('@utils/response');
const fileService = require('@utils/FileService');
const { sendEmail } = require('@utils/emailUtility');
const jwt = require('jsonwebtoken');

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
    const to = customerData.email;
    const subject = 'Welcome to DigiBank';
    const text = `Hello ${customerData.full_name},\n\n🎉🎉 Welcome to DigiBank 🎉🎉\n We're delighted to have you on board. Thank you for creating an account. Explore our features/products/services, and if you have any questions, our support team is here to help at beautysleeping86@gmail.com. We're thrilled to be a part of your journey with DigiBank and look forward to providing you with a fantastic experience. Welcome aboard!\n\nBest regards,\nDigiBank Team`;

    sendEmail(to, subject, text);

    // return response.res201(res, customer);
    res.redirect('/view/login');
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
  // return res.redirect(`/view/homePage?token=${token}`);
  return response.res200(res, { customer, token });
};

const forgotPassword = async (req, res) => {
  const { username } = req.body;
  const customer = await prisma.customer.findFirst({
    where: { username },
  });

  if (!customer) {
    return response.res404(res, 'user not found');
  }
  if (!customer.email) {
    return response.res404(res, 'email does not exist');
  }
  const token = generateResetToken(username);
  const resetURL = `${process.env.BASE_URL}/view/resetPassword?token=${token}`;
  const to = customer.email;
  const subject = 'Password Reset Instructions';
  const text = `Click the following link to reset your password: \n${resetURL}`;
  sendEmail(to, subject, text);
  return response.res200(res, 'email send succesfully');
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const token = req.headers.referer.split('token=')[1];
    const { JWT_SECRET_KEY } = process.env;

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const {username} = decoded;

    const user = await prisma.customer.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashedPassword = await encryptPassword(password);
    await prisma.customer.update({
      where: { customer_id: parseInt(user.customer_id, 10) },
      data: { password: hashedPassword },
    });

    // res.json({ message: 'Password reset successfully' });
    const to = user.email;
    const subject = 'Password Changed';
    const text = `Password reset successfully`;
    sendEmail(to, subject, text);
    res.redirect('/view/login');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { login, register, forgotPassword, resetPassword };
