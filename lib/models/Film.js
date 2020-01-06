const mongoose = require('mongoose');

const schema = new mongoose.Schema ({
  title: {
    type: String,
    required: true
  },
  studioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Date,
    required: true
  },
  cast:[{
    role: { 
      nameOfCharacter: {
        type : String,
      },
      actorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
      }
    }
  }],
});

module.exports = mongoose.model('Film', schema);
