exports = module.exports = {};

exports.getRating = userObj => 
  ((userObj.reviews.reduce((a, b) => a + b, 0) / userObj.reviews.length) || 0).toFixed(2);

exports.calculateRate = currentTime => {
  if (currentTime > 16)
    return 1.75;
  else if (currentTime > 9)
    return 1.00;
  else
    return 1.25;
}

exports.getContent = (url) => {
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    })
};