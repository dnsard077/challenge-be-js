const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const response = require('@utils/response');
const { userSchema } = require('@validators/userValidator');
const bcrypt = require('bcrypt');
const fileService = require('@utils/FileService');

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage, 10) || 10;

    const offset = (page - 1) * itemsPerPage;

    const users = await prisma.customer.findMany({
      select: {
        customer_id: true,
        full_name: true,
        gender: true,
        address: true,
        phone_number: true,
        email: true,
        date_of_birth: true,
        identification_number: true,
        created_at: true,
        updated_at: true,
        is_delete: true,
        username: true,
      },
      take: itemsPerPage,
      skip: offset,
    });

    if (users.length <= 0) {
      return response.res404(res, users);
    }

    return response.res200(res, users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userid;
  try {
    const user = await prisma.customer.findUnique({
      where: { customer_id: parseInt(userId, 10) },
      select: {
        customer_id: true,
        full_name: true,
        gender: true,
        address: true,
        phone_number: true,
        email: true,
        date_of_birth: true,
        identification_number: true,
        created_at: true,
        updated_at: true,
        is_delete: true,
        username: true,
        image: true,
        account: {
          select: {
            account_number: true,
          },
        },
      },
    });

    if (!user) {
      return response.res404(res);
    }

    return response.res200(res, user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const addCustomer = async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    customerData.password = hashedPassword;
    if (imageUrl) {
      customerData.image = imageUrl;
    }
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

const updateCustomer = async (req, res) => {
  const userId = req.params.userid;
  const customerData = req.body;

  try {
    let imageUrl;
    if (req.file) {
      try {
        imageUrl = await fileService.imgUpload(req.file);
      } catch (uploadError) {
        return response.res400(res, { error: uploadError.message });
      }
    }
    const existingUser = await prisma.customer.findUnique({
      where: { customer_id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      return response.res404(res, 'User not found');
    }
    if (imageUrl) {
      customerData.image = imageUrl;
    }

    const updatedCustomer = await prisma.customer.update({
      where: { customer_id: parseInt(userId, 10) },
      data: customerData,
    });

    return response.res200(res, updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

const deleteCustomer = async (req, res) => {
  const userId = req.params.userid;

  try {
    const existingUser = await prisma.customer.findUnique({
      where: { customer_id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      return response.res404(res, 'User not found');
    }

    await prisma.customer.delete({
      where: { customer_id: parseInt(userId, 10) },
    });

    return response.res200(res, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting customer:', error);
    return response.res500(res);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getUsers, getUserById, addCustomer, updateCustomer, deleteCustomer,
};
