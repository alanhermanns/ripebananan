const mongoose = require('mongoose');

const schema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  address: {
    city: {
      type: String,
      required: true
    },
    state:{
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  } }, {
  toJSON: {
    virtuals: true
  }
});

schema.virtual('Films', [{
  ref: 'Film',
  localField: '_id',
  foreignField: 'studioId'
}]);

module.exports = mongoose.model('Studio', schema);
  
