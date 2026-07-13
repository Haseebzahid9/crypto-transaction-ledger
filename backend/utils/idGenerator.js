const { v4: uuidv4 } = require('uuid');

module.exports = () => `TX-${uuidv4()}`;
