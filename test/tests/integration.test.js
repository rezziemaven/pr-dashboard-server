const app = require('../../server.js');
const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;

describe('PR Dashboard API Integration Tests', () => {
  const newObj = {
    number: 42
  };

  const wrongObj = {
    number: 33
  };

  describe('#GET / test', () => {
    it('should get \'I am a teapot!\' and status 200', (done) => {
      request(app).get('/test')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('string');
          expect(res.body).to.equal('I am a teapot!');
          done();
        });
    });
  });

  describe('##POST / test', () => {
    it('should create a new object with value 42', (done) => {
      request(app).post('/test').send(newObj).end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.number).to.equal(42);
        done();
      });
    });
    it('should return an status 400 if number is not 42', (done) => {
      request(app).post('/test').send(wrongObj).end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.equal('Number not found');
        done();
      });
    });
  });
});