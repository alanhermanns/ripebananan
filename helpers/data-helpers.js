require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seed = require('./seed');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Studio = require('../lib/models/Studio');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed();
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
  const modelName = Model.modelName;

  return {
    [`get${modelName}`] : () => Model.findOne().then(prepare),
    [`get${modelName}s`] : () => Model.find().then(docs => docs.map(doc => prepare(doc)))
  };
};

module.exports = {
  ...createGetters(Actor),
  ...createGetters(Film),
  ...createGetters(Studio),
  ...createGetters(Reviewer),
  ...createGetters(Review)
};
