require('dotenv').config();
const mongoose = require('mongoose');
const { 
  getActor, getActors,
  getStudio, getStudios,
  getFilm, getFilms,
  getReviewer, getReviewers,
  getReview, getReviews
} = require('../helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('app routes', () => {

  it('gets all studios', async() => {
    const studios = await getStudios();
    return request(app)
      .get('/studios')
      .then(res => {
        studios.forEach(studio => {
          expect(res.body).toContainEqual(
            expect.objectContaining({
              '_id' : studio._id.toString(),
              'name' : studio.name
            }));
        });
      });
  });
});
it('gets a studio by id', async() => {
  const studio = await getStudio();
  return request(app)
    .get(`/studios/${studio._id}`)
    .then(res => {
      expect(res.body).toEqual({
        '__v': 0,
        '_id' : studio._id.toString(),
        'name' : studio.name,
        'address' : {
          'city' : studio.address.city,
          'state': studio.address.state,
          'country': studio.address.country,
        },
      });
    });
});
it('gets all actors', () => {
  const actors = getActors();
  return request(app)
    .get('/actors')
    .then(res => {
      res.body.forEach(actor => {
        expect.objectContaining({
          '_id' : actor._id,
          'name': actor.name
        });
      });
    });
});
it('gets an actor by id', async() => {
  const actor = await getActor();
  return request(app)
    .get(`/actors/${actor._id}`)
    .then(res => {
      expect(res.body).toEqual({ 
        'DOB': actor.DOB, 
        'POB': actor.POB,
        '__v': 0,
        '_id': actor._id.toString(),
        'name': actor.name });
    });
});
it('gets an film by id', async() => {
  const film = await getFilm();
  const theCast = film.cast.map(thing => thing);
  return request(app)
    .get(`/films/${film._id}`)
    .then(res => {
      expect(res.body).toEqual({
        __v: 0,
        _id: film._id.toString(),
        title : film.title,
        studioId : {
          _id: film.studioId,
          name: res.body.studioId.name
        },
        released: film.released,
        cast: theCast
      });
    });
});
it('gets all films', async() => {
  const films = await getFilms();
  return request(app)
    .get('/films')
    .then(res => {
      expect(res.body).toHaveLength(films.length);
      films.forEach(film => {
        //let theCast = film.cast.map(thing => thing);
        expect(res.body).toContainEqual({
          _id: film._id,
          title: film.title,
          released: film.released,
          studioId: expect.any(Object)
        });
      });
    });
});
// expect.objectContaining({
//   __v: 0,
//   _id: film._id.toString(),
//   title : film.title,
//   studioId : {
//     __v: 0,
//     _id: film.studioId._id,
//     address: film.studioId.address,
//     name: film.studioId.name
//   },
//   released: film.released,
//   cast: theCast
// }));

it('gets all reviewers', async() => {
  const reviewers = await getReviewers();
  return request(app)
    .get('/reviewers')
    .then(res => {
      expect(res.body.forEach(reviewer => {
        expect.objectContaining({
          '__v': 0,
          '_id': expect.any(String),
          'company': reviewer.company,
          'name': reviewer.name
        });
      }));
    });
});
it('gets a reviewer by id', async() => {
  const reviewer = await getReviewer();
  return request(app)
    .get(`/reviewers/${reviewer._id}`)
    .then(res => {
      expect(res.body).toEqual({
        '__v': 0,
        '_id': reviewer._id.toString(),
        'company': reviewer.company,
        'name': reviewer.name
      });
    });
});
it('modifies a reviewer by id', async() => {
  const reviewer = await getReviewer();
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
        'name': reviewer.name
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
  const review = await getReview();
  return request(app)
    .delete(`/reviews/${review._id}`)
    .then(res => {
      expect(res.body).toEqual({
        '__v': 0,
        '_id': review._id.toString(),
        'rating': review.rating,
        'reviewer': res.body.reviewer.toString(),
        'review': review.review,
        'film': res.body.film.toString()
      }
      );
    });
});
it('gets the top 100 reviews', async() => {
  const reviews = await getReviews();
  //200
  return request(app)
    .get('/reviews')
    .then(res => {
      expect(res.body).toHaveLength(100);
      res.body.forEach(review => {
        expect(reviews).toContainEqual(review);
      });
    });
}); 
