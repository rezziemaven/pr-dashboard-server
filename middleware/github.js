const crypto = require('crypto');
const keys = require('../config/keys');
const Raven = require('raven');

require('../services/raven');

module.exports = (req, res, next) => {
  const allowedUserAgent = 'GitHub-Hookshot/';
  const reqUserAgent = req.headers['user-agent'].match(/.+?\//gi).toString();
  console.log("user agent",reqUserAgent);

  const requestSignature = req.headers['x-hub-signature'];
  let hmac = crypto.createHmac('sha1', keys.githubWebhookSecret);
  hmac.update(JSON.stringify(req.body));
  const calculatedSignature = 'sha1=' + hmac.digest('hex');
  console.log("signature",calculatedSignature);

  if (reqUserAgent !== allowedUserAgent || requestSignature !== calculatedSignature) {
    Raven.captureException('Unable to store Pull Request!');
    return res.status(403).send({ message: 'Method not allowed.' });
  }

  next();
};


//hello
