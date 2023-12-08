const request = require('supertest');
const server = require('./server');

afterAll(() => {
    // Close the server after all tests are done
    server.close();
});
describe('Form Submission Test', () => {
    it('should return a 500 status code for an invalid min sal that exceeds the limit', async () => {
      const response = await request(server)
        .post('/')
        .send({
          min_sal: 5000000000000000,
          gpa: 3.5,
          intrest: 'High',
        });
  
      expect(response.status).toBe(500);
    });
    it('should return a 500 status code for an invalid min sal that is a string', async () => {
        const response = await request(server)
          .post('/')
          .send({
            min_sal: "ssss",
            gpa: 3.5,
            intrest: 'High',
          });
    
        expect(response.status).toBe(500);
      });
      it('should return a 500 status code for an invalid gpa that is not forrmatted and is upove 5.0', async () => {
        const response = await request(server)
          .post('/')
          .send({
            min_sal: 3500,
            gpa: 100,
            intrest: 'High',
          });
    
        expect(response.status).toBe(500);
      });
  
    it('should return a 500 status code for an invalid gpa that is a string', async () => {
      const response = await request(server)
        .post('/')
        .send({
          min_sal: 3500,
          gpa: "A+",
          intrest: 'Medium',
        });
  
      expect(response.status).toBe(500);
    });
    it('should return a 500 status code for an invalid list item from the intrests', async () => {
        const response = await request(server)
          .post('/')
          .send({
            min_sal: 3500,
            gpa: 3.5,
            intrest: 'tall',
          });
    
        expect(response.status).toBe(500);
      });
});