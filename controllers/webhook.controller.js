const mongoose = require('mongoose');
const Pullrequest = require('../models/Pullrequest.js');
const Repository = require('../models/Repository.js');
const User = require('../models/User.js');
const keys = require('../config/keys');
const Raven = require('raven');
const { io } = require('../setupServer');
const fetch = require('node-fetch');
const pullrequestController = require('./pullrequest.controller');

require('../services/raven');

module.exports.newEvent = async (req, res) => {
  // First message to test the Webhook from Github


  if (req.body.zen && req.body.hook) return res.status(200).send();

  if (!req.body.pull_request && req.body.comment) {
    const comment = await Pullrequest.findOne({
      apiUrl: req.body.issue.pull_request.url,
    });
    await comment.update({
      $set: { comments: req.body.issue.comments, seen: false },
    });

    const repo = await Repository.findOne({
      githubId: req.body.repository.id
    })


    const owners = await User.find({
      _repositories: {$elemMatch: {repository: repo._id}}
    })

    const owner = await User.findOne({
      githubId: req.body.repository.owner.id,
    });

    const newPulls = await Pullrequest.find({ closed_at: null });

    owner.socket.forEach(client => {
      io.to(client.socketId).emit('message', {
        type: 'pull_request',
        payload: newPulls,
      });
    });

    return res.status(200).send();
  }

  //commetn

  const {
    id,
    html_url,
    url,
    state,
    title,
    body,
    comments,
    user,
    created_at,
    updated_at,
    closed_at,
    merged_at,
  } = req.body.pull_request;

  const existPullrequest = await Pullrequest.findOne({ githubId: id });
  const values = {
    githubId: id,
    action: req.body.action,
    number: req.body.number,
    webUrl: html_url,
    apiUrl: url,
    state: state,
    title: title,
    comment: body,
    comments: comments,
    user: {
      githubId: user.id,
      loginName: user.login,
      picture: user.avatar_url,
      apiUrl: user.url,
      webUrl: user.html_url,
    },
    created_at: created_at,
    updated_at: updated_at,
    closed_at: closed_at,
    merged_at: merged_at,
  };

  const owner = await User.findOne({
    githubId: req.body.repository.owner.id,
  });

  if (!existPullrequest) {
    try {
      let repo = await Repository.findOne({
        githubId: req.body.repository.id,
      });
      if(!repo) {
        const {id, owner, ...repoData} = req.body.repository;
        repo = await Repository.create({
          githubId: id,
          ...repoData,
        });
      }

      values.repository = repo;
      values.owner = owner;

      const pullrequest = new Pullrequest(values);
      await pullrequest.save();

      await repo.update({
        $push: { _pullRequests: { pullRequest: pullrequest._id } },
      });

      const newPulls = await Pullrequest.find({ closed_at: null });

      owner && owner.socket.forEach(client => {
        io.to(client.socketId).emit('message', {
          type: 'pull_request',
          payload: newPulls,
        });
      });
      res.status(201).send({ message: 'Pull request created.' });
    } catch (e) {
      Raven.captureException(e);
      res.status(400).send({
        errors: [e.message]
      });
    }
  } else {
    try {
      await existPullrequest.update(values);
      const newPulls = await Pullrequest.find({ closed_at: null });

      owner && owner.socket.forEach(client => {
        io.to(client.socketId).emit('message', {
          type: 'pull_request',
          payload: newPulls,
        });
      });
      res.status(200).send({ message: 'Pull request updated.' });
    } catch (e) {
      Raven.captureException(e);
      res.status(400).send(e);
    }
  }
};

module.exports.enable = async (req, res) => {
  const repo = await Repository.findOne({
    _id: req.params.id,
    owner: req.user.id,
    hookEnabled: false,
  });

  if (!repo) return res.status(404).send();

  const webHookData = {
    name: 'web',
    active: true,
    events: ['pull_request', 'issue_comment'],
    config: {
      url: keys.githubWebhookUrl,
      content_type: 'json',
      secret: keys.githubWebhookSecret,
    },
  };
  const config = {
    method: 'POST',
    body: JSON.stringify(webHookData),
    headers: {
      Authorization: 'token ' + req.user.accessToken,
    },
  };
  try {
    const webhook = await fetch(repo.hookUrl, config);
    const data = await webhook.json();

    await repo.update({
      hookEnabled: true,
      hookId: data.id,
    });
    await pullrequestController.update(repo, req.user);

    res.status(200).send({ id: repo._id });
  } catch (e) {
    Raven.captureException(e);
    res.status(500).send(e);
  }
};

module.exports.disable = async (req, res) => {
  const repo = await Repository.findOne({
    _id: req.params.id,
    owner: req.user.id,
    hookEnabled: true,
  });

  if (!repo) return res.status(404).send();

  const config = {
    method: 'DELETE',
    headers: {
      Authorization: 'token ' + req.user.accessToken,
    },
  };

  try {
    const url = `${repo.hookUrl}/${repo.hookId}`;
    await fetch(url, config);
    await Pullrequest.remove({ owner: req.user.id, repository: repo._id });
    await repo.update({
      hookEnabled: false,
      hookId: null,
    });

    res.status(200).send({ id: repo._id });
  } catch (e) {
    Raven.captureException(e);
    res.status(500).send();
  }
};
