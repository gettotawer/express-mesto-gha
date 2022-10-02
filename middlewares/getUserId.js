const jwt = require('jsonwebtoken');
const { SECRET } = require('../consts/secret');

module.exports = (id) => jwt.verify(id, SECRET);
