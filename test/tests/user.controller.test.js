const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { describe, it, afterEach } = require('mocha');
const { expect, assert } = require('chai')



describe('test', () => {
  const ravenMock = sinon.stub()
  const axiosMock = sinon.stub()
  const keysMock = sinon.stub()
  let userControllers, req, res

  userControllers = proxyquire
      .noCallThru()
      .load('../../controllers/user.controller.js', {
         '../models/User.js': {
           find: sinon.stub().resolves(true),
         }
        }
      )
  
  res = {
    status: (status) => {
      res.statusC = status
      return {
        send: (whateva) => whateva && console.log(whateva) //console.log(whateva)
      }
    },
  };
  req = {
    user: {
      id: 1
    }
  };

  it('should return a user', async () => {
    await userControllers.me(req, res)
    expect(res.statusC).equal(200)
    // expect(userControllers.me).toBeCalled();

  });
})


