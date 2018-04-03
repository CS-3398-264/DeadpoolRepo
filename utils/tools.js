exports.getRating = userObj => 
  ((userObj.reviews.reduce((a, b) => a + b, 0) / userObj.reviews.length) || 0).toFixed(2);