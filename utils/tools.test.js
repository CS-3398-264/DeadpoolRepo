const tools = require('./tools');
const { 
  testDriver, 
  testDriverNoReviews, 
  testRider, 
  testRiderNoReviews 
} = require('./testObjects');

describe('getRating should return the average rating (or 0) for a driver/rider', () => {
  test('Should return the average of a driver/rider with at least one review (to 2 decimals)', () => {
    expect(tools.getRating(testDriver)).toBe("4.62");
    expect(tools.getRating(testRider)).toBe("4.03");
  });
  test('Should return "0.00" when there are no reviews for a driver/rider', () => {
    expect(tools.getRating(testDriverNoReviews)).toBe("0.00");
    expect(tools.getRating(testRiderNoReviews)).toBe("0.00");
  });
    
});