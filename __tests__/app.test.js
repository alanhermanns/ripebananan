require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Reviewer = require('../lib/models/Reviewer');
let studio;
let actor;
describe('app routes', () => {
  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  beforeEach(() => {
    studio = Studio
      .create({
        _id : mongoose.Types.ObjectId(),
        name : 'studio',
        address : {
          city : 'city',
          state: 'bad shape',
          country: 'state',
        }
      }
      );
  });
  beforeEach(() => {
    return Actor
      .create({
        name : 'fred',
        DOB : '1/2/1977',
        POB : 'Somewhere'
      }
      );
  });
  beforeEach(() => {
    return Reviewer
      .create({
        name : 'fred',
        company : 'Company'
      }
      );
  });
  afterAll(() => {
    return mongoose.connection.close();
  });
  it('gets all studios', () => {
    return request(app)
      .get('/studios')
      .then(res => {
        expect(res.body).toEqual([
          {
            '_id' : expect.any(String),
            'name' : 'studio'
          }
        ]);
      });
  });
  it('gets a studio by id', async() => {
    studio = await Studio
      .create({
        name : 'thinger',
        address : {
          city : 'city2',
          state: 'good shape',
          country: 'state',
        }
      })
      .then(studio => {
        return request(app)
          .get(`/studios/${studio._id}`)
          .then(res => {
            expect(res.body).toEqual({
              '__v': 0,
              '_id' : studio._id.toString(),
              'name' : 'thinger',
              'address' : {
                'city' : 'city2',
                'state': 'good shape',
                'country': 'state',
              },
            });
          });
      });
  });
  it('gets all actors', () => {
    return request(app)
      .get('/actors')
      .then(res => {
        expect(res.body).toEqual([
          {
            '_id' : expect.any(String),
            'name': 'fred'
          }
        ]);
      });
  });
  it('gets an actor by id', async() => {
    actor = await Actor
      .create({
        name : 'fred',
        DOB : '1/2/1977',
        POB : 'Somewhere'
      });
    return request(app)
      .get(`/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          'DOB': '1977-01-02T08:00:00.000Z', 
          'POB': 'Somewhere',
          '__v': 0,
          '_id': actor._id.toString(),
          'name': 'fred' });
      });
  });
  it('gets all films', () => {
    return request(app)
      .get('/films')
      .then(res => {
        expect(res.body).toEqual([]);
      });
  });
  it('gets all reviewers', () => {
    return request(app)
      .get('/reviewers')
      .then(res => {
        expect(res.body).toEqual([{ 
          '__v': 0,
          '_id': expect.any(String),
          'id': expect.any(String),
          'company': 'Company',
          'name': 'fred' }]);
      });
  });
  it('posts a studio', () => {
    return request(app)
      .post('/studios')
      .send(
        {
          name : 'studio',
          address : {
            city : 'city',
            state: 'bad shape',
            country: 'state',
          }
        })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: res.body._id,
          name : 'studio',
          address : {
            city : 'city',
            state: 'bad shape',
            country: 'state',
          }
        });
      });
  });
  it('posts a film', () => {
    return request(app)
      .post('/films')
      .send(
        {
          title : 'studio',
          studioId : mongoose.Types.ObjectId(),
          released: '2/2/2000',
          cast: [{
            role: {
              nameOfCharacter : 'charazard',
              actorId : mongoose.Types.ObjectId()
            }
          }]
        })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          '_id': res.body._id,
          'cast': [{
            '_id': res.body.cast[0]._id,
            'role': {
              'actorId': res.body.cast[0].role.actorId,
              'nameOfCharacter': 'charazard',
            },
          }],
          'title': 'studio',
          'released': '2000-02-02T08:00:00.000Z',
          'studioId': res.body.studioId,
        });
      });
  });
});
