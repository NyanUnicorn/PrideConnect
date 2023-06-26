const request = require('supertest');
const baseURL = 'http://localhost:3000';

describe('Users Routes', () => {
  let userId;

  beforeAll(async () => {
    // Create a new user for testing
    const newUser = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const response = await request(baseURL).post('/users').send(newUser);
    userId = response.body.id;
  });

  afterAll(async () => {
    // Delete the created user after all tests are done
    await request(baseURL).delete(`/users/${userId}`);
  });

  it('GET /users should return a list of all users', async () => {
    const response = await request(baseURL).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('GET /users/:id should return a specific user by ID', async () => {
    const response = await request(baseURL).get(`/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('POST /users should create a new user', async () => {
    const newUser = {
      email: 'newuser@example.com',
      name: 'New User',
    };
    const response = await request(baseURL).post('/users').send(newUser);
    expect(response.status).toBe(200 || 201);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('PUT /users/:id should update a specific user by ID', async () => {
    const updatedUser = {
      email: 'updated@example.com',
      name: 'Updated User',
    };
    const response = await request(baseURL).put(`/users/${userId}`).send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('DELETE /users/:id should delete a specific user by ID', async () => {
    const response = await request(baseURL).delete(`/users/${userId}`);
    expect(response.status).toBe(200 || 204);
    // Add more assertions as needed
  });

  it('GET /users/:id/messages should return all messages from a specific user', async () => {
    const response = await request(baseURL).get(`/users/${userId}/messages`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('GET /users/:id/players should return all players associated with a specific user', async () => {
    const response = await request(baseURL).get(`/users/${userId}/players`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });
});
