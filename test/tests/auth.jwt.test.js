const { describe, it, afterEach } = require('mocha');
const { expect, assert, should } = require('chai')
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const rewire = require('rewire')
const JwtControllers  = rewire('../../controllers/auth.jwt.controller')




describe('auth.jwt.controllers - tests', () => {

  before(() => {
    this.req = {
      user: {
        id: 5
      }
    }
    
    this.res = {
      header: "",
      setHeader: (data) => {
        this.header = data
      },
      send: () => {}
    }

    this.JwtControllers = {
      generateUserToken: (sinon.stub())
    }
  })

  it('should be called', () => {
    expect(JwtControllers.generateUserToken).to.be.ok
  })

  it('should use req and res', () => {
    _this = this
    expect(_this.JwtControllers.generateUserToken.calledOnce).to.equal(true)
  })


})