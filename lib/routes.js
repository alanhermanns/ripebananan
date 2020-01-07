const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('./models/Film');
const Reviewer = require('./models/Reviewer');
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
        console.log('!!!!!!!!!!!!!!!!!!!P', studio);
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
  });

