const path = require('path');

module.exports = {
  entry: './node_modules/jwt-decode/build/jwt-decode.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jwt-decode.js',
  },
};