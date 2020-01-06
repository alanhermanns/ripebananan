const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const { Router } = require('express');

module.exports = Router()
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
  .get('/studio/:id', (req, res, next) => {
    const id = req.params.id;
    Studio
      .findById(id)
      .populate('films')
      .then(studio => {
        res.send(studio);
      })
      .catch(next);
  })
  .get('/actor/:id', (req, res, next) => {
    const id = req.params.id;
    Actor
      .findById(id)
      .populate('films')
      .then(actor => {
        res.send(actor);
      })
      .catch(next);
  });
