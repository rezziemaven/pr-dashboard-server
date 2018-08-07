const db = [];

module.exports.get = (req, res) => {
  // res.status(200).send('I\'m a teapot!');
  res.json('I am a teapot!');
}

module.exports.post = (req, res) => {
  if (req.body.number === 42) {
    db.push(req.body);
    res.status(201).send(req.body);
  } else {
    res.status(400).json('Number not found');
  }
}