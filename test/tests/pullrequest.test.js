const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { describe, it } = require('mocha');
const { expect } = require('chai');
require('../../controllers/pullrequest.controller.js')



describe('test for pull request controllers', () => {

  const pullrequestControllers = proxyquire.noCallThru().load('../../controllers/pullrequest.controller.js', {
    '../models/Pullrequest.js': {
      find: sinon.stub().resolves(true),
    }
  });

});