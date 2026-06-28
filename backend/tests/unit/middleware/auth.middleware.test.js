const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');
jest.mock('../../../models/User', () => ({
  findByPk: jest.fn(),
}));

const User = require('../../../models/User');
const { protect } = require('../../../middleware/auth.middleware');

describe('protect middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, app: { get: jest.fn() } };
    res = { status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  it('calls next with error when no Authorization header is present', async () => {
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toMatch(/token missing/i);
  });

  it('calls next with error when Authorization header does not start with Bearer', async () => {
    req.headers.authorization = 'Basic sometoken';
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('calls next with error when JWT verification fails', async () => {
    req.headers.authorization = 'Bearer invalid.token.here';
    jwt.verify.mockImplementation(() => {
      throw new Error('jwt malformed');
    });
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toMatch(/invalid token/i);
  });

  it('calls next with error when user no longer exists in the database', async () => {
    req.headers.authorization = 'Bearer valid.token.here';
    jwt.verify.mockReturnValue({ id: 99 });
    User.findByPk.mockResolvedValue(null);

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('attaches user to req and calls next() for a valid token', async () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' };
    req.headers.authorization = 'Bearer valid.token.here';
    jwt.verify.mockReturnValue({ id: 1 });
    User.findByPk.mockResolvedValue(mockUser);

    await protect(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledWith(); // called with no arguments (no error)
  });
});
