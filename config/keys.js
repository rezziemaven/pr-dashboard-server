'use strict'

const env = process.env.NODE_ENV || 'development';
const config = require(`./${env}`);

module.exports = config;

// if (process.env.NODE_ENV === 'production') {
//   module.exports = require('./prod');
// } else {
//   module.exports = require('./dev');
// }
