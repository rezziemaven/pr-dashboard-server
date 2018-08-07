const Pullrequest = require('../models/Pullrequest.js')
const Raven = require('raven');
const axios = require('axios');

require('../services/raven');

module.exports.listAll = async (req, res) => {
  try {
    const pullrequests = await Pullrequest.find(
      { closed_at: null },
      {
        user: true,
        closed_at: true,
        merged_at: true,
        created_at: true,
        updated_at: true,
        action: true,
        number: true,
        webUrl: true,
        state: true,
        title: true,
        review: true,
        comment: true,
        comments: true,
        repository: true,
        seen: true,
      },
    ).populate('repository', {
      name: true,
      fullName: true,
      private: true,
      webUrl: true,
      description: true,
      color: true,
      language: true,
    }).sort([['created_at','ascending']]);
    // console.log("PULL REQS", pullrequests)
    res.status(200).send(pullrequests);
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send(e);
  }
};

module.exports.update = async (repo, user) => {
  const axiosConfig = {
    headers: { Authorization: 'token ' + user.accessToken },
  };
  const fetchPulls = await axios.get(repo.pullUrl, axiosConfig);
  // console.log("PULLURL", repo.pullUrl)
  // console.log("FETCHPULLS", fetchPulls)

  await Promise.all(fetchPulls.data.map(async pull => {
    // console.log(pull);
    const comments = await axios.get(pull.comments_url, axiosConfig)
    // console.log("COMMENTS", comments.data.length)
    const commentsBody = comments.data.map(comment => comment.body)
    console.log("COMMENT BODY", commentsBody)
    // console.log("pull", pull)
    const values = {
      githubId: pull.id,
      number: pull.number,
      webUrl: pull.html_url,
      apiUrl: pull.url,
      state: pull.state,
      title: pull.title,
      comment: pull.body,
      comments: commentsBody.length || 0,
      commentsBody: commentsBody,
      owner: user._id,
      repository: repo._id,
      user: {
        githubId: pull.user.id,
        loginName: pull.user.login,
        picture: pull.user.avatar_url,
        apiUrl: pull.user.url,
        webUrl: pull.user.html_url,
      },
      created_at: pull.created_at,
      updated_at: pull.updated_at,
      closed_at: pull.closed_at,
      merged_at: pull.merged_at,
    };
    const thisPull = await Pullrequest.findOne({githubId: pull.id})
    if (thisPull) {
      await Pullrequest.findOneAndUpdate(
        {
          githubId: pull.id
        },
        {
          $set: values
        },
        {new: true}
      )
    } else {
      await new Pullrequest(values).save();
    }
  }));
};

module.exports.seen = async (req, res) => {
  try {
    await Pullrequest.findOneAndUpdate(
      {_id: req.params.id},
      { $set: { seen: true } },
    );
    res.status(200).send({ id: req.params.id });
  } catch (e) {
    Raven.captureException(e);
    res.status(404).send();
  }
};

module.exports.count = async (req, res) => {
  try {
    const count = await Pullrequest.find({
      seen: false,
    });
    res.status(200).send({ count: count.length });
  } catch (e) {
    Raven.captureException(e);
    res.status(404).send();
  }
};
