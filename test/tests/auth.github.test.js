const { describe, it, afterEach, called } = require('mocha');
const { expect, assert, should } = require('chai')
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const rewire = require('rewire')
const githubAuthControllers  = rewire('../../controllers/auth.github.controller')


describe('auth.github.controllers - tests', () => {

  beforeEach(() => {

    this.passport = {
      authenticate: sinon.spy()
    }
    githubAuthControllers.__set__('passport', this.passport)

  })



  describe('auth function',() => {

    it('.auth should be called', () => {
      expect(githubAuthControllers.auth).to.be.ok
    })

    it('.auth should return an authentication function', () => {
      const _this = this
      const authenticate = githubAuthControllers.auth()
      expect(_this.passport.authenticate.callCount).to.equal(1)
    })

    it('should get authenticated with "github"', () => {
      const _this = this
      const authenticate = githubAuthControllers.auth()
      expect(_this.passport.authenticate.calledWith('github')).to.equal(true)
    })
  })

  describe('private function',() => {

    it('.private should be called', () => {
      expect(githubAuthControllers.private).to.be.ok
    })

    it('.auth should return an authentication function', () => {
      const _this = this
      const authenticate = githubAuthControllers.private()
      expect(_this.passport.authenticate.callCount).to.equal(1)
    })

    it('should get authenticated with "github"', () => {
      const _this = this
      const authenticate = githubAuthControllers.auth()
      expect(_this.passport.authenticate.calledWith('github')).to.equal(true)
    })
  })

  describe('callback function',() => {

    it('.callback should be called', () => {
      expect(githubAuthControllers.callback).to.be.ok
    })

    it('.auth should return an authentication function', () => {
      const _this = this
      const authenticate = githubAuthControllers.callback()
      expect(_this.passport.authenticate.callCount).to.equal(1)
    })

    it('should get authenticated with "github"', () => {
      const _this = this
      const authenticate = githubAuthControllers.auth()
      expect(_this.passport.authenticate.calledWith('github')).to.equal(true)
    })
  })




})