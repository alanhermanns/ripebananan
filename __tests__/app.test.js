require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Film = require('../lib/models/Film');
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
      });
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
  it('gets an film by id', async() => {
    const film = await Film
      .create({
        title : 'good title',
        studioId : mongoose.Types.ObjectId(),
        released: '2/2/1990',
        cast: [{
          role: {
            nameOfCharacter : 'blink182',
            actorId : mongoose.Types.ObjectId()
          }
        }]
      });
    return request(app)
      .get(`/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: film._id.toString(),
          title : 'good title',
          studioId : res.body.studioId,
          released: '1990-02-02T08:00:00.000Z',
          cast: [{
            _id: res.body.cast[0]._id,
            role: {
              nameOfCharacter : 'blink182',
              actorId : res.body.cast[0].role.actorId
            }
          }]
        });
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
          'company': 'Company',
          'name': 'fred' }]);
      });
  });
  it('gets a reviewer by id', async() => {
    const reviewer = await Reviewer.create({
      'company': 'Doug',
      'name': 'Doug'
    });
    return request(app)
      .get(`/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          '__v': 0,
          '_id': reviewer._id.toString(),
          'company': 'Doug',
          'name': 'Doug'
        });
      });
  });
  it('gets a modifies by id', async() => {
    const reviewer = await Reviewer.create({
      'company': 'Doug',
      'name': 'Doug'
    });
    return request(app)
      .put(`/reviewers/${reviewer._id}`)
      .send({
        company: 'Frank'
      })
      .then(res => {
        expect(res.body).toEqual({
          '__v': 0,
          '_id': reviewer._id.toString(),
          'company': 'Frank',
          'name': 'Doug'
        });
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
  it('posts an actor', () => {
    return request(app)
      .post('/actors')
      .send(
        {
          name : 'fred',
          DOB : '1/2/1977',
          POB : 'Somewhere'
        })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          '_id': res.body._id,
          'name': 'fred',
          DOB : '1977-01-02T08:00:00.000Z',
          POB : 'Somewhere'
        });
      });
  });
  it('posts a reviewer', () => {
    return request(app)
      .post('/reviewers')
      .send(
        {
          name : 'Fred',
          company : 'Thinger'
        })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          '_id': res.body._id,
          'name': 'Fred',
          'company': 'Thinger'
        });
      });
  });
  it('posts a review', async() => {
    const review = {
      'rating': '3',
      'review': 'Poorly written, I think.',
      'reviewer': mongoose.Types.ObjectId(),
      'film': mongoose.Types.ObjectId()
    };
    return request(app)
      .post('/reviews')
      .send(review)
      .then(res => {
        expect(res.body).toEqual({
          '__v': 0,
          '_id': res.body._id,
          'rating': 3,
          'reviewer': expect.any(String),
          'review': 'Poorly written, I think.',
          'film': expect.any(String)
        }
        );
      });
  });
  it('deletes a review', async() => {
    const review = await Review.create({
      'rating': '3',
      'review': 'Poorly written, I think.',
      'reviewer': mongoose.Types.ObjectId(),
      'film': mongoose.Types.ObjectId()
    });
    return request(app)
      .delete(`/reviews/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          '__v': 0,
          '_id': review._id.toString(),
          'rating': 3,
          'reviewer': res.body.reviewer.toString(),
          'review': 'Poorly written, I think.',
          'film': res.body.film.toString()
        }
        );
      });
  });
  it('gets the top 100 reviews', async() => {
    let arrOf100 = Array(105);
    arrOf100.fill('');
    const review = {
      'rating': '5',
      'review': 'Poorly written, I think.',
      'reviewer': mongoose.Types.ObjectId(),
      'film': mongoose.Types.ObjectId()
    };
    let newArrOf100 = arrOf100.map(async item => await Review
      .create(review));
    return request(app)
      .get('/reviews')
      .then(res => {
        expect(res.body).toEqual([{
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }, {
          '__v': 0,
          '_id': expect.any(String),
          'film': expect.any(String),
          'rating': 5,
          'review': 'Poorly written, I think.',
          'reviewer': expect.any(String),
        }]);
      });
  });
});
