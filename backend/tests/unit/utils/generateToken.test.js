const jwt = require('jsonwebtoken');
const generateToken = require('../../../utils/generateToken');

describe('generateToken', () => {
  it('returns a string', () => {
    const token = generateToken(1);
    expect(typeof token).toBe('string');
  });

  it('encodes the userId in the payload', () => {
    const token = generateToken(42);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(42);
  });

  it('expires in 7 days when JWT_EXPIRES_IN is 7d', () => {
    const token = generateToken(1);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    expect(decoded.exp - decoded.iat).toBe(sevenDaysInSeconds);
  });

  it('generates unique tokens for different user IDs', () => {
    const token1 = generateToken(1);
    const token2 = generateToken(2);
    expect(token1).not.toBe(token2);
  });
});
