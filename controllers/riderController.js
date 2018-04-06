const { riderModel } = require('../models');
const { getRating } = require('../utils/tools');

exports = module.exports = {};

exports.riderID = (req, res, next, riderID) => {
  riderModel.findOne({ _id : riderID }, (err, doc) => {
    if (err) req.rider = null;
    else req.rider = doc;
  }).then(doc => {
    return next();
  }).catch(err => { 
    return next(); 
  });
}

exports.getRiderByID = (req, res) => { 
  if (req.rider) res.send(req.rider);
  else res.sendStatus(404);
}

exports.getAllRiders = (req, res) => {
  riderModel.find((err, docs) => {
    if (docs) res.json(docs);
    else res.sendStatus(404);
  }).catch(err => {
    res.sendStatus(400);
  })
}

exports.getRiderRating = (req, res) => { 
  if (req.rider) res.json(getRating(req.rider));
  else res.sendStatus(404);
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

exports.removeRider = (req, res) => {
  // this is our "authentication" for now
  if (req.body.password === 'admin123') {
    if (req.rider) {
      riderModel.remove({ _id : req.rider._id })
        .then(doc => {
          res.sendStatus(200);
        }).catch(err => {
          res.sendStatus(400);
        });
    } else { 
      res.sendStatus(404);
    }
  }
}