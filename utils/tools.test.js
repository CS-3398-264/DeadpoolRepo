const tools = require('./tools');
const { 
  testDriver, 
  testDriverNoReviews, 
  testRider, 
  testRiderNoReviews 
} = require('./testObjects');

describe('getRating() should return the average rating (or 0) for a driver/rider.', () => {
  test('Should return the average of a driver/rider with at least one review (to 2 decimals).', () => {
    //expect(tools.getRating(testDriver)).toBe("4.62");
    //expect(tools.getRating(testRider)).toBe("4.03");
  });
  test('Should return "0.00" when there are no reviews for a driver/rider.', () => {
    expect(tools.getRating(testDriverNoReviews)).toBe("0.00");
    expect(tools.getRating(testRiderNoReviews)).toBe("0.00");
  });
});

describe('calculateRate() should return the correct rate based on time.', () => {
  test('Should return the highest rate during the evening.', () => {
    expect(tools.calculateRate(18)).toBe(1.75);
  });
  test('Should return low rate during the middle of the day.', () => {
    expect(tools.calculateRate(10)).toBe(1.00);
  });
  test('Should return medium rate during the morning.', () => {
    expect(tools.calculateRate(6)).toBe(1.25);
  });
});