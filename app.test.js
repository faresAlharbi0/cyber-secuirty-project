const request = require('supertest');
const server = require('./server');

afterAll(() => {
    // Close the server after all tests are done
    server.close();
});
describe('Form Submission Test', () => {
    it('should return a 200 status code for a valid form submission', async () => {
      const response = await request(server)
        .post('/')
        .send({
          min_sal: 50000,
          gpa: 3.5,
          intrest: 'High',
        });
  
      expect(response.status).toBe(200);
    });
  
    it('should return a 500 status code for an invalid form submission', async () => {
      // Adjust the request to simulate an error condition in your form processing logic
      const response = await request(server)
        .post('/')
        .send({
          min_sal: 19999999, // Assuming this is an invalid value based on your form processing logic
          gpa: 3.0,
          intrest: 'Medium',
        });
  
      expect(response.status).toBe(500);
    });
});