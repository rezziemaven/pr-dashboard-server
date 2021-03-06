const authGithubController = require('../controllers/auth.github.controller');
const authJwtController = require('../controllers/auth.jwt.controller');
const webhookController = require('../controllers/webhook.controller');
const pullrequestController = require('../controllers/pullrequest.controller');
const repoController = require('../controllers/repo.controller');
const userController = require('../controllers/user.controller');
const webSocketController = require('../controllers/websockets.controller');
const githubMiddleware = require('../middleware/github');
const requireAuth = require('../middleware/requireAuth');
const testController = require('../test/test.controller.js');

module.exports = app => {
  // Integration test routes
  app.get('/test', testController.get);
  app.post('/test', testController.post);
  app.get('/v1/user/me/pullrequests/test', pullrequestController.listAll);
  app.patch('/v1/user/me/pullrequests/:id/seen/test', pullrequestController.seen);
  app.get('/v1/user/me/pullrequests/count/test', pullrequestController.count);

   //TEST

  // Authentication
  app.get('/v1/auth/github', authGithubController.auth());
  app.get('/v1/auth/github/private', authGithubController.private());
  app.get('/v1/auth/callback',
    authGithubController.callback(),
    authJwtController.generateUserToken,
  );

  // Current User
  app.get('/v1/user/me', requireAuth(), userController.me);

  // Pull requests

 
  app.get('/v1/user/me/pullrequests', requireAuth(), pullrequestController.listAll);
  app.patch('/v1/user/me/pullrequests/:id/seen',
    requireAuth(),
    pullrequestController.seen,
  );
  app.get('/v1/user/me/pullrequests/count', requireAuth(), pullrequestController.count);

  // Repositories
  app.get('/v1/user/me/repos', requireAuth(), repoController.listAll);
  app.get('/v1/user/me/repos/:id/pullrequests',
    requireAuth(),
    repoController.listPullrequests,
  );
  app.post('/repos/socket', repoController.socket);

  // Repository settings
  app.patch('/v1/user/me/repos/:id/color', requireAuth(), repoController.color);

  // Github Webhooks
  app.post('/v1/user/me/webhooks', githubMiddleware, webhookController.newEvent);
   // app.post('/v1/user/me/webhooks', webhookController.newEvent);
  app.patch('/v1/user/me/repos/:id/enable', requireAuth(), webhookController.enable);
  app.patch('/v1/user/me/repos/:id/disable', requireAuth(), webhookController.disable);

  // Temporary Websockets communication
  app.get('/pr-update', webSocketController.test);
  app.get('/repos-update', webSocketController.reposUpdate);
};
