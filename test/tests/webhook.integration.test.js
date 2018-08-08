const { describe, it, afterEach } = require('mocha');
const { expect, assert, should } = require('chai')
const app = require('../../server.js');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const rewire = require('rewire');
const request = require('supertest');
const webhookController  = rewire('../../controllers/webhook.controller')
const mockWebhookReq = require('../mocks/webhook.mock.json');

describe('Webhook controller', () => {
  describe('newEvent', () => {
    it('should be called', () => {
      expect(webhookController.newEvent).to.be.ok;
    })
    it('should send webhook data to database', () => {
      request(app).post('/v1/user/me/webhooks').send(mockWebhookReq).end((err, res) => {
        expect(res.statusCode).to.equal(200);
        // expect(res.body.number).to.equal(42);
      })
    })
  })
});

