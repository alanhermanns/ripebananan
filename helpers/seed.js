const chance = require('chance').Chance();
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Studio = require('../lib/models/Studio');
module.exports = async({ actor = 100, studio = 10, film = 30, reviewer = 10, review = 40 } = {}) => {
  const studios = await Studio.create([...Array(studio)].map(() => ({
    name : chance.name(),
    address : {
      city : chance.city(),
      state: chance.state(),
      country: chance.country(),
    }
  })));

  const actors = await Actor.create([...Array(actor)].map(() => ({
    name : chance.name(),
    DOB : chance.date(),
    POB : chance.address()
  })));

  const films = await Film.create([...Array(film)].map(() => ({
    title : chance.name_suffix(),
    studioId : chance.pickone(studios.map(aStudio => aStudio._id)),
    released: chance.date(),
    cast: [...Array({ min : 1, max : actor }).map(() => ({
      role: {
        nameOfCharacter : chance.name(),
        actorId : chance.pickone(actors.map(actor => actor._id))
      }
    }))]
  })));

  const reviewers = await Reviewer.create([...Array(reviewer)].map(() => ({
    name : chance.name(),
    company: chance.street_suffixes()
  })));

  const reviews = await Review.create([...Array(review)].map(() => ({
    rating: (5 * (Math.random())).floor(),
    review: chance.sentence(),
    reviewer: chance.pickone(reviewers.map(aReviewer => aReviewer._id)),
    film: chance.pickone(films.map(aFilm => aFilm._id))
  })));
};
