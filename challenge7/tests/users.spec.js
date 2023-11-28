const supertest = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../app');

const prisma = new PrismaClient();

describe('User API Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeAll(async () => {
    const userData = {
      full_name: 'agus',
      gender: 'Male',
      address: 'test',
      email: 'test@mail.com',
      date_of_birth: '1990-02-15T00:00:00.000Z',
      identification_number: '12312321',
      username: 'username1',
      password: 'password',
      phone_number: '1231232132',
    };

    await supertest(app).post('/api/v1/users').send(userData);
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const response = await supertest(app).get('/api/v1/users');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should handle errors when getting all users', async () => {
      const response = await supertest(app).get('/api/v1/users?page=9999999&itemsPerPage=0');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toEqual(0);
    });
  });

  describe('POST /api/users', () => {
    it('should add a new user', async () => {
      const userData = {
        full_name: 'agus',
        gender: 'Male',
        address: 'test',
        email: 'test@mail.com',
        date_of_birth: '1990-02-15T00:00:00.000Z',
        identification_number: '12312321',
        username: `username${Math.random() * 99999}`,
        password: 'password',
        phone_number: '1231232132',
      };

      const response = await supertest(app).post('/api/v1/users').send(userData);
      const { data } = response.body;
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('CREATED');
      expect(response.body.data).toBeDefined();
      expect(data.full_name).toBe('agus');
      expect(data.gender).toBe('Male');
      expect(data.address).toBe('test');
      expect(data.email).toBe('test@mail.com');
      expect(data.date_of_birth).toBe('1990-02-15T00:00:00.000Z');
      expect(data.identification_number).toBe('12312321');
      expect(data.username).toContain('username');
      expect(data.password).toBeDefined();
      expect(data.phone_number).toBe('1231232132');
      expect(data.created_at).toBeDefined();
      expect(data.updated_at).toBeDefined();
      expect(data.is_delete).toBe(false);
    });

    it('should handle validation error when adding a new user with invalid data', async () => {
      const userData = {
        full_name: 'agus',
        gender: 'Male',
        address: 'test',
        email: 'test@mail.com',
        date_of_birth: '1990-02-15T00:00:00.000Z',
        identification_number: '12312321',
        username: `username${Math.random() * 99999}`,
        password: 'password',
        phone_number: '1231232132',
      };

      await supertest(app).post('/api/v1/users').send(userData);
      const response2 = await supertest(app).post('/api/v1/users').send(userData);
      expect(response2.status).toBe(400);
      expect(response2.body.message).toBe('Someone is already using the username you have chosen. Please try using another one instead.');
    });
  });

  describe('GET /api/users/:userid', () => {
    it('should get a user by ID', async () => {
      const response = await supertest(app).get('/api/v1/users/1');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(response.body.data).toBeDefined();
    });

    it('should handle not found error when getting a user by non-existent ID', async () => {
      const response = await supertest(app).get('/api/users/99999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });

  describe('PUT /api/users/:userid', () => {
    it('should update an existing user', async () => {
      const updatedUserData = {
        full_name: 'rio dewata',
      };
      const response = await supertest(app).put('/api/v1/users/1').send(updatedUserData);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('SUCCESS');
      expect(response.body.data).toBeDefined();
    });

    it('should handle not found error when updating a non-existent user', async () => {
      const updatedUserData = {
        full_name: 'rio dewata',
      };
      const response = await supertest(app).put('/api/users/99999').send(updatedUserData);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });

  describe('DELETE /api/users/:userid', () => {
    it('should handle not found error when deleting a non-existent user', async () => {
      const response = await supertest(app).delete('/apiv1/users/999999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT FOUND');
    });
  });
});
