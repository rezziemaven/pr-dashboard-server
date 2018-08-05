const { describe, it, afterEach } = require('mocha');
const { expect, assert, should } = require('chai')
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const githubAuthControllers  = require('../../controllers/auth.github.controller')


describe('auth.github.controllers - tests', () => {

  const passport = sinon.stub()
  // githubAuthControllers = proxyquire
  //   .noCallThru()
  //   .load('../../controllers/auth.github.controllers.js', stub)
  
  it('.auth should be called', () => {
    expect(githubAuthControllers.auth).to.be.ok
  })

  it('.auth should return an authentication function', () => {
    const authenticate = githubAuthControllers.auth()
    expect(typeof(authenticate)).to.equal('function')
  })



  it('.private should be called', () => {
    expect(githubAuthControllers.private).to.be.ok
  })

  it('.auth should return an authentication function', () => {
    const authenticate = githubAuthControllers.private()
    expect(typeof(authenticate)).to.equal('function')
  })



  it('.callback should be called', () => {
    expect(githubAuthControllers.callback).to.be.ok
  })

  it('.auth should return an authentication function', () => {
    const authenticate = githubAuthControllers.callback()
    expect(typeof(authenticate)).to.equal('function')
  })




})