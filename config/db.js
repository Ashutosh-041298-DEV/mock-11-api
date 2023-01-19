const mongoose = require('mongoose');
require("dotenv").config();
const connect = mongoose.connect(process.env.mongoDB_URL)

module.exports = connect;