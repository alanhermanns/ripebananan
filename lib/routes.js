const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('./models/Film');
const Reviewer = require('./models/Reviewer');
const Review = require('../lib/models/Review');
const { Router } = require('express');

module.exports = Router()
  .post('/studios', (req, res, next) => {
    Studio
      .create(req.body)
      .then(studio=>{
        res.send(studio);
      })
      .catch(next);
  })
  .post('/films', (req, res, next) => {
    Film
      .create(req.body)
      .then(film=>{
        res.send(film);
      })
      .catch(next);
  })
  .post('/actors', (req, res, next) => {
    Actor
      .create(req.body)
      .then(actor => {
        res.send(actor);
      })
      .catch(next);
  })
  .post('/reviewers', (req, res, next) => {
    Reviewer
      .create(req.body)
      .then(reviewer => {
        res.send(reviewer);
      })
      .catch(next);
  })
  .post('/reviews', (req, res, next) => {
    Review
      .create(req.body)
      .then(review => {
        res.send(review);
      })
      .catch(next);
  })
  .get('/studios', (req, res, next) => {
    Studio
      .find()
      .select({ name : true })
      .then(studioNames =>{
        res.send(studioNames);
      })
      .catch(next);
  })
  .get('/actors', (req, res, next) => {
    Actor
      .find()
      .select({ name : true })
      .then(actorNames =>{
        res.send(actorNames);
      })
      .catch(next);
  })
  .get('/actors/:id', (req, res, next) => {
    const id = req.params.id;
    Actor
      .findById(id)
      .populate('films')
      .then(actor => {
        res.send(actor);
      })
      .catch(next);
  })
  .get('/films', (req, res, next) => {
    Film
      .find()
      .populate('studioId')
      .select({ _id: true, released: true, title: true })
      .then(films => {
        res.send(films);
      })
      .catch(next);
  })
  .get('/studios/:id', (req, res, next) => {
    const id = req.params.id;
    Studio
      .findById(id)
      .populate('films')
      .then(studio => {
        res.send(studio);
      })
      .catch(next);
  })
  .get('/reviewers', (req, res, next) => {
    Reviewer
      .find()
      .then(reviewers => {
        res.send(reviewers);
      })
      .catch(next);
  })
  .get('/reviewers/:id', (req, res, next) => {
    const id = req.params.id;
    Reviewer
      .findById(id)
      .populate('review')
      .then(reviewer => {
        res.send(reviewer);
      })
      .catch(next);
  })
  .get('/films/:id', (req, res, next) => {
    const id = req.params.id;
    Promise.all([
      Film
        .findById(id)
        .populate('studioId', 'name'),
      Review
        .find()
        .select({ film : id, rating : true, reviewer : true, review : true })
    ])
      .then((film, review) => {
        res.send(...film, review);
      })
      .catch(next);
  })
  .get('/reviews', (req, res, next) => {
    Review
      .find()
      .limit(100)
      .sort({ rating : -1 })
      .then(reviews => {
        res.send(reviews);
      })
      .catch(next);
  })
  .delete('/reviews/:id', (req, res, next) => {
    const id = req.params.id;
    Review
      .findByIdAndDelete(id)
      .then(deletedReview => {
        res.send(deletedReview);
      })
      .catch(next);
  })
  .put('/reviewers/:id', (req, res, next) => {
    const id = req.params.id;
    Reviewer
      .findByIdAndUpdate(id, req.body, { new : true })
      .then(reviewer => {
        res.send(reviewer);
      })
      .catch(next);
  });
