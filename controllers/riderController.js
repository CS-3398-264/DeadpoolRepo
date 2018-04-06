const { riderModel } = require('../models');
const { getRating } = require('../utils/tools');

exports = module.exports = {};

exports.riderID = (req, res, next, riderID) => {
  riderModel.findOne({ _id : riderID }).then(doc => {
    req.rider = doc;
    return next();
  }).catch(err => { 
    req.rider = null;
    return next(); 
  });
}

exports.getRiderByID = (req, res) => { 
  if (req.rider) 
    res.json(req.rider);
  else 
    res.sendStatus(404);
}

exports.getAllRiders = (req, res) => {
  riderModel.find((err, docs) => {
    if (docs) 
      res.json(docs);
    else 
      res.sendStatus(404);
  }).catch(err => {
    res.sendStatus(400);
  })
}

exports.getRiderRating = (req, res) => { 
  if (req.rider) 
    res.json(getRating(req.rider));
  else 
    res.sendStatus(404);
}

exports.addRider = (req, res) => {
  if (req.body.name) {
    const newRider = new riderModel({
      name: req.body.name,
      reviews: []
    });
    newRider.save()
      .then(doc => {
        res.sendStatus(200);
        console.log('saved new Rider "%s" to db. id: %s', doc.name, doc._id);
      }).catch(err => {
        res.sendStatus(400);
      });
  } else {
    res.sendStatus(400);
  } 
}