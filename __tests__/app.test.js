require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  beforeEach(() => {
    return Studio
      .create({
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
            'id' : expect.any(String),
            'name' : 'studio'
          }
        ]);
      });
  });
  it('gets a studio by id', async() => {
    return request(app)
      .get('/studios/1234')
      .then(res => {
        expect(res.body).toEqual({ 'message': 'Not Found', 'status': 404 });
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
  it('gets an actor by id', () => {
    return request(app)
      .get('/actors/1234')
      .then(res => {
        expect(res.body).toEqual({ 'message': 'Not Found', 'status': 404 });
      });
  });
  it('gets all films', () => {
    return request(app)
      .get('/films')
      .then(res => {
        expect(res.body).toEqual(
          { 'message': 'Not Found', 'status': 404 }
        );
      });
  });
});
