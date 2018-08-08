const { describe, it, afterEach } = require('mocha');
const { expect, assert, should } = require('chai')
const app = require('../../server.js');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const rewire = require('rewire');
const request = require('supertest');
const webhookController  = rewire('../../controllers/webhook.controller');
const mockWebhookComments = require('../mocks/webhookWithComments.mock.js');
const mockWebhookPullRequest = require('../mocks/webhookWithPullRequest.mock.js');
const mockWebhookPullRequestUpdated = require('../mocks/webhookWithPullRequestUpdated.mock.js');
const Pullrequest = require('../../models/Pullrequest.js');
let pullReqItems;
let pullReqsAfter;
const prArray = [207046228];



describe('Webhook controller', () => {
  describe('newEvent', () => {

 beforeEach( async () => {
      pullReqItems = await Pullrequest.find({});
    })

 afterEach( () => {
      // await Pullrequest.deleteOne({githubId: 207046228});
      setTimeout( async () => {
      for (let prId of prArray) {
        await Pullrequest.deleteOne({githubId: prId});
      }
      },3000)

    })
    it('should be called', () => {
      expect(webhookController.newEvent).to.be.ok;
    });

    it('should have the right headers', () => {
      request(app)
      .post('/v1/user/me/webhooks')
      .set('user-agent','GitHub-Hookshot/cac83ef')
      .set('x-hub-signature','sha1=83166c5d5f6204b13ba81fd63717d9f17a806e4d')
      .expect('user-agent','GitHub-Hookshot')
      .expect(200);
    });

    it('should send a status of 403 if headers are incorrect', () => {
      request(app)
      .post('/v1/user/me/webhooks')
      .set('user-agent','GitHub-Hokshot/cac83ef')
      .set('x-hub-signature','sha1=83166c5d5f6204b13ba81fd63717d9f17a806e4d')
      .expect(403);
    });

    it('should deal with the comments', () => {
      request(app)
      .post('/v1/user/me/webhooks')
      .set('user-agent','GitHub-Hookshot/cac83ef')
      .set('x-hub-signature','sha1=83166c5d5f6204b13ba81fd63717d9f17a806e4d')
      .set('Accept','application/json')
      .send(mockWebhookComments)
      .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          console.error(err);
        });
    });

      //before test check if in db or db.length


    it('should add pull request database if it does not exists', (done) => {

      request(app)
      .post('/v1/user/me/webhooks')
      .set('user-agent','GitHub-Hookshot/cac83ef')
      .set('x-hub-signature','sha1=450f2f3d689244147e64aabeae5536411ca773d5')
      .set('Accept','application/json')
      .send(mockWebhookPullRequest)
      .end( async (err, res) => {
          try {
            expect(res.statusCode).to.equal(201);
          pullReqsAfter = await Pullrequest.find({});
          expect(pullReqsAfter.length).to.equal(pullReqItems.length+1);
          }
          catch (e) {
            console.error(err);
          }

        });
      done();
    });



    //new test to check if it is added to the db

    it('should check if pull request already exists', (done) => {
      request(app)
      .post('/v1/user/me/webhooks')
      .set('user-agent','GitHub-Hookshot/cac83ef')
      .set('x-hub-signature','sha1=4c12726d8fa946d7a548290e411753ed22995ae4')
      .set('Accept','application/json')
      .send(mockWebhookPullRequestUpdated)
      .end( async (err, res) => {
        try {
           expect(res.statusCode).to.equal(200);
          pullReqsAfter = await Pullrequest.find({});
          expect(pullReqsAfter.length).to.equal(pullReqItems.length);
        }
        catch (e) {
          if (err) {
            console.error(err);
          }
        }


        });
      done();
    });

    it('should handle a stream of new pull requests', (done) => {

      for (let i=1; i<10; i++) {
        let newPR = mockWebhookPullRequest;
        newPR.pull_request.id+=i;
        prArray.push(newPR.pull_request.id);
      request(app)
      .post('/v1/user/me/webhooks')
      .set('user-agent','GitHub-Hookshot/cac83ef')
      .set('x-hub-signature','sha1=4c12726d8fa946d7a548290e411753ed22995ae4')
      .set('Accept','application/json')
      .send(newPR)
      .end( async (err, res) => {
        try {
           expect(res.statusCode).to.equal(201);
          pullReqsAfter = await Pullrequest.find({});
          expect(pullReqsAfter.length).to.equal(pullReqItems.length+1+i);
          await Pullrequest.deleteOne({githubId: newPR.pull_request.id});
        }
        catch (e) {
          if (err) {
            console.error(err);
          }
        }


        });
      }
      done();
    });



  })
});

