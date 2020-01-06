const mongoose = require('mongoose');

const schema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
  },
  POB:{
    type: String,
  }
});

module.exports = mongoose.model('Actor', schema);
