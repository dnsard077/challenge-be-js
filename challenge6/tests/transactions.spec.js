const supertest = require('supertest');
const { PrismaClient } = require('@prisma/client');
const server = require('../app');
const prisma = new PrismaClient();

describe('Transaction Controller Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/transactions', () => {
    it('should get transactions with pagination', async () => {
      const response = await supertest(server).get('/api/v1/transactions?page=1&itemsPerPage=1');
      const { data } = response.body;

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].transaction_id).toBeDefined();
      expect(data[0].transaction_type).toBeDefined();
      expect(data[0].amount).toBeDefined();
      expect(data[0].from_account_id).toBeDefined();
      expect(data[0].to_account_id).toBeDefined();
      expect(data[0].branch_id).toBeDefined();
      expect(data[0].created_at).toBeDefined();
      expect(data[0].updated_at).toBeDefined();
    });

    it('should handle errors when getting all transactions', async () => {
      const response = await supertest(server).get('/api/v1/transactions?page=9999999&itemsPerPage=999999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });

  describe('GET /api/transactions/:transactionId', () => {
    it('should get transaction details by transaction ID', async () => {
      const response = await supertest(server).get('/api/v1/transactions/1');
      const { data } = response.body;

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(data).toBeDefined();
      expect(data.transaction_id).toBeDefined();
      expect(data.transaction_type).toBeDefined();
      expect(data.amount).toBeDefined();
      expect(data.from_account_id).toBeDefined();
      expect(data.to_account_id).toBeDefined();
      expect(data.branch_id).toBeDefined();
      expect(data.created_at).toBeDefined();
      expect(data.updated_at).toBeDefined();
    });

    it('should handle not found error when getting transaction details by non-existent transaction ID', async () => {
      const nonExistentTransactionId = 9999999;
      const response = await supertest(server).get(`/api/v1/transactions/${nonExistentTransactionId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        from_account_id: 1,
        to_account_id: 2,
        amount: "100",
        transaction_type: 'Transfer',
        branch_id: 1,
      };

      const response = await supertest(server).post('/api/v1/transactions').send(transactionData);
      const { data } = response.body;

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(data).toBeDefined();
      expect(data.transaction_id).toBeDefined();
      expect(data.transaction_type).toBe(transactionData.transaction_type);
      expect(data.amount).toBe(transactionData.amount);
      expect(data.from_account_id).toBe(transactionData.from_account_id);
      expect(data.to_account_id).toBe(transactionData.to_account_id);
      expect(data.branch_id).toBe(transactionData.branch_id);
      expect(data.created_at).toBeDefined();
      expect(data.updated_at).toBeDefined();
    });

    it('should handle validation error when creating a transaction with invalid data', async () => {
      const invalidTransactionData = {
        from_account_id: 'invalid_account_id',
        to_account_id: 'invalid_account_id',
        amount: 'invalid_amount',
        transaction_type: 'InvalidType',
        branch_id: 'invalid_branch_id',
      };

      const response = await supertest(server).post('/api/v1/transactions').send(invalidTransactionData);
      expect(response.status).toBe(400);
    });

    it('should handle not found error when creating a transaction with non-existent account IDs', async () => {
      const nonExistentAccountId = 9999999;
      const transactionData = {
        from_account_id: nonExistentAccountId,
        to_account_id: nonExistentAccountId + 1,
        amount: 100,
        transaction_type: 'Transfer',
        branch_id: 1,
      };

      const response = await supertest(server).post('/api/v1/transactions').send(transactionData);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });

    it('should handle insufficient balance error when creating a withdrawal transaction', async () => {
      const insufficientBalanceData = {
        from_account_id: 1,
        amount: 10000,
        branch_id: 1,
      };

      const response = await supertest(server).post('/api/v1/transactions').send(insufficientBalanceData);
      expect(response.status).toBe(400);
    });

    it('should handle invalid transaction type error', async () => {
      const invalidTransactionTypeData = {
        from_account_id: 1,
        to_account_id: 2,
        amount: 100,
        transaction_type: 'InvalidType',
        branch_id: 1,
      };

      const response = await supertest(server).post('/api/v1/transactions').send(invalidTransactionTypeData);
      expect(response.status).toBe(400);
    });
  });
});
