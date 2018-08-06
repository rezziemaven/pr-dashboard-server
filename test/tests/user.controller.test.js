const proxyquire = require('proxyquire');
const {spy, stub} = require('sinon');
const { describe, it, afterEach } = require('mocha');
const chai = require('chai')
const expect = chai.expect
const should = chai.should()

describe('userController.me', () => {
  const mock = stub();
  const ravenMock = {
    captureException: stub()
  }
  let userController, req, res, status, send, me, e;
  userController = proxyquire
    .noCallThru()
    .load('../../controllers/user.controller.js', {
       '../models/User.js': {
         find: stub(),
       },
       'raven': ravenMock,
       'axios': mock,
       'keys': mock
      }
    );
    // status = stub();
    // send = spy();
    res = {
      status: stub().returns ({
        send: spy()
      })
    };
    // status.returns(res);

  describe('When user has been returned', () => {

    beforeEach(async () => {
      req = { user: {id: 1} };
      await userController.me(req, res);
      })

    it('should set the status to 200', ()=> {
      res.status.calledWith(200).should.be.true;
    });

    it('should return a result', ()=> {

      res.status(200).send.calledWith(me).should.be.true;
      expect(res.status(200).send.calledOnce).to.be.true;
    });
  });

  describe('When there is an error', () => {

    beforeEach(async () => {
      req = { users: {id: 1}};
      await userController.me(req, res);
      })

    it('should set the status to 400', ()=> {
      res.status.calledWith(400).should.be.true;
    });

    it('should return a result', ()=> {

      res.status(400).send.calledWith(e).should.be.true;
      expect(res.status(400).send(e).calledOnce).to.be.true;
    });
  });


})


