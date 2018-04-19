exports = module.exports = {};

exports.testDriver = {
  "reviews": [
    {
      "tripID": "5ad7fefd0b5bdad75e2ff1c3",
      "score": 4.98
  },
  {
      "tripID": "5ad80a9b3a2237da7bb4b534",
      "score": 4.99
  },
  {
      "tripID": "5ad80a9b3a2237da7bb4b53z",
      "score": 2.99
  }
  ],
  "_id": "5abdd27a734d1d0cf303e71f",
  "name": "Test Driver1",
  "vehicle": "testCar",
  "capacity": 3,
  "available": true,
  "currentTrip": "none"
};
exports.testDriverNoReviews = {
  "reviews": [],
  "_id": "5abdd27a734d1d0cf303e71f",
  "name": "Test Driver2",
  "vehicle": "testCar",
  "capacity": 5,
  "available": false,
  "currentTrip": "none"
};
exports.testRider = {
  "reviews": [
    {
      "tripID": "5ad7fefd0b5bdad75e2ff1c3",
      "score": 4.98
  },
  {
      "tripID": "5ad80a9b3a2237da7bb4b534",
      "score": 4.99
  },
  {
      "tripID": "5ad80a9b3a2237da7bb4b53z",
      "score": 2.99
  }
  ],
  "_id": "5abdd2d6734d1d0cf303e742",
  "name": "Test Rider1"
};
exports.testRiderNoReviews = {
  "reviews": [],
  "_id": "5abdd2d6734d1d0cf303e742",
  "name": "Test Rider2"
};