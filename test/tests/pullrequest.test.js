const { describe, it, afterEach } = require('mocha');
const { expect, assert, should } = require('chai')
const app = require('../../server.js');
const request = require('supertest');
const prControllers = require('../../controllers/pullrequest.controller')
const Pullrequest = require('../../models/Pullrequest.js');

const pullReqs = require('../mocks/pullRequestGetAllReq')

describe('Pull request controller', () => {

  describe("list all function", () => {

    it('should be called', () => {
      expect(prControllers.listAll).to.be.ok
    })

    it('should return 200 status', () => {
      request(app)
        .get('/v1/user/me/pullrequests/test', (req,res) => {})
        .expect(200)
    })

    it('should get all PullRequets', (done) => {
      //try to add the user id onto the req
       request(app)
        .get('/v1/user/me/pullrequests/test')
        .set('Accept', 'application/json')
        .expect(200, pullReqs, done)
    })

  })

  describe('seen function', () => {
    const repoId = '5b6b4821b35e992a6d49d8c7'

    after( async () => {
      await Pullrequest.findOneAndUpdate(
        {_id: repoId},
        {$set: { seen: false } }
      )
    });

    it('respond with a 200', (done) => {
      request(app)
        .patch(`/v1/user/me/pullrequests/${repoId}/seen/test`)
        .expect(200, done)
    })

    it('should actually be changing', async () => {
      const pr = await Pullrequest.findOne({
        _id: repoId
      })
      expect(pr.seen).to.be.true
    })

  })

  describe('count function', () => {

    it('should return the repos counted', (done) => {
      request(app)
        .get('/v1/user/me/pullrequests/count/test')
        .expect(200, {count: 5}, done)
    })

  })

})




