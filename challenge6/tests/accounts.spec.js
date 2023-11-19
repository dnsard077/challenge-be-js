const supertest = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../app');

const prisma = new PrismaClient();

describe('Account Controller Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeAll(async () => {
    const userData = {
      full_name: 'test user',
      gender: 'Male',
      address: 'test address',
      email: 'testuser@mail.com',
      date_of_birth: '1990-02-15T00:00:00.000Z',
      identification_number: '1234567890',
      username: 'testuser',
      password: 'testpassword',
      phone_number: '1234567890',
    };

    const userResponse = await supertest(app).post('/api/v1/users').send(userData);
    userId = userResponse.body.data.customer_id;
  });

  describe('POST /api/v1/accounts/:userid', () => {
    it('should add an account to a user', async () => {
      const accountData = {
        account_number: '1234567890123456',
        balance: '1000',
        account_type: 'Savings',
        status: 'Active',
      };

      const response = await supertest(app).post('/api/v1/accounts/1').send(accountData);
      const { data } = response.body;

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(data).toBeDefined();
      expect(data.account_id).toBeDefined();
      expect(data.account_number).toBe(accountData.account_number);
      expect(data.balance).toBe(accountData.balance);
      expect(data.account_type).toBe(accountData.account_type);
      expect(data.status).toBe(accountData.status);
      expect(data.created_at).toBeDefined();
      expect(data.updated_at).toBeDefined();
      expect(data.is_delete).toBe(false);
    });

    it('should handle validation error when adding an account with invalid data', async () => {
      const accountData = {
        account_number: 'invalid_account_number',
        balance: 'invalid_balance',
        account_type: 'InvalidType',
        status: 'InvalidStatus',
      };

      const response = await supertest(app).post('/api/v1/accounts/1').send(accountData);
      expect(response.status).toBe(400);
    });

    it('should handle not found error when adding an account to a non-existent user', async () => {
      const nonExistentUserId = 9999999;
      const accountData = {
        account_number: '1234567890123456',
        balance: 1000,
        account_type: 'Savings',
        status: 'Active',
      };

      const response = await supertest(app).post(`/api/v1/accounts/${nonExistentUserId}`).send(accountData);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });

  describe('GET /api/accounts/:userid', () => {
    it('should get accounts by user ID', async () => {
      const response = await supertest(app).get('/api/v1/accounts/1');
      const { data } = response.body;

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].account_id).toBeDefined();
      expect(data[0].account_number).toBeDefined();
      expect(data[0].balance).toBeDefined();
      expect(data[0].account_type).toBeDefined();
      expect(data[0].status).toBeDefined();
      expect(data[0].created_at).toBeDefined();
      expect(data[0].updated_at).toBeDefined();
      expect(data[0].is_delete).toBeDefined();
    });

    it('should handle not found error when getting accounts by non-existent user ID', async () => {
      const nonExistentUserId = 9999999;
      const response = await supertest(app).get(`/api/v1/accounts/${nonExistentUserId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });

  describe('GET /api/accounts', () => {
    it('should get all accounts with pagination', async () => {
      const response = await supertest(app).get('/api/v1/accounts?page=1&itemsPerPage=1');
      const { data } = response.body;

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].account_id).toBeDefined();
      expect(data[0].account_number).toBeDefined();
      expect(data[0].balance).toBeDefined();
      expect(data[0].account_type).toBeDefined();
      expect(data[0].status).toBeDefined();
      expect(data[0].created_at).toBeDefined();
      expect(data[0].updated_at).toBeDefined();
      expect(data[0].is_delete).toBeDefined();
    });

    it('should handle errors when getting all accounts', async () => {
      const response = await supertest(app).get('/api/v1/accounts?page=9999999&itemsPerPage=999999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });
});
