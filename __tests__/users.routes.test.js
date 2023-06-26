
import request from 'supertest';
import nextApp from '../server/server.js'
// Define the base URL
const baseURL = 'http://localhost:8989';

// Describe the test suite for the user routes
describe('User Routes', () => {
  let userId; 
  let supertest

  // Run this code before all the tests in this suite
  beforeAll(async () => {
    supertest = request(nextApp);

    // Create a new user for testing
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
    };

    // Send a POST request to create a new user
    const response = await supertest
      .post(`/users`)
      .set('Content-Type', 'application/json')
      .send(newUser);

    userId = response.body.id
    console.log(`User Id: ${userId}`);
  });

  // Run this code after all the tests in this suite
  afterAll(async () => {
    // Delete the created user after all tests are done
    await supertest
      .delete(`/users/${userId}`)
      .set('Content-Type', 'application/json');
  });

  // Test the GET /users route
  it('should retrieve a list of all users', async () => {
    const response = await supertest
      .get('/users')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test the GET /users/:id route
  it('should retrieve a specific user by ID', async () => {
    const response = await supertest
      .get(`/users/${userId}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  // Test the POST /users route
  it('should create a new user', async () => {
    const newUser = {
      name: 'New User',
      email: 'newuser@example.com',
    };

    const response = await supertest
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  // Test the PUT /users/:id route
  it('should update a specific user by ID', async () => {
    const updatedUser = {
      name: 'Updated User',
      email: 'updateduser@example.com',
    };

    const response = await supertest
      .put(`/users/${userId}`)
      .set('Content-Type', 'application/json')
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedUser.name);
    expect(response.body.email).toBe(updatedUser.email);
  });

  // Test the DELETE /users/:id route
  it('should delete a specific user by ID', async () => {
    const response = await supertest
      .delete(`/users/${userId}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(204);
  });
});
