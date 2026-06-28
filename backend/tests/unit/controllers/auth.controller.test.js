jest.mock('../../../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));
jest.mock('../../../utils/generateToken', () => jest.fn(() => 'mock-jwt-token'));

const User = require('../../../models/User');
const generateToken = require('../../../utils/generateToken');
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require('../../../controllers/auth.controller');

const mockUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  avatar: '',
  matchPassword: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
  ...overrides,
});

const makeReqRes = (body = {}, user = null) => ({
  req: { body, user, params: {} },
  res: { status: jest.fn().mockReturnThis(), json: jest.fn() },
  next: jest.fn(),
});

describe('register', () => {
  it('creates a user and returns 201 with a token', async () => {
    const { req, res, next } = makeReqRes({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret123',
    });
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(mockUser({ id: 5, name: 'Alice', email: 'alice@example.com' }));

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 5, token: 'mock-jwt-token', name: 'Alice' })
    );
  });

  it('returns 400 and calls next when the email is already registered', async () => {
    const { req, res, next } = makeReqRes({
      name: 'Bob',
      email: 'existing@example.com',
      password: 'secret123',
    });
    User.findOne.mockResolvedValue(mockUser());

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('login', () => {
  it('returns a token on valid credentials', async () => {
    const user = mockUser();
    const { req, res, next } = makeReqRes({
      email: 'test@example.com',
      password: 'correctpassword',
    });
    User.findOne.mockResolvedValue(user);

    await login(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'mock-jwt-token', _id: 1 })
    );
  });

  it('returns 401 when user is not found', async () => {
    const { req, res, next } = makeReqRes({
      email: 'nobody@example.com',
      password: 'anything',
    });
    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('returns 401 when password does not match', async () => {
    const user = mockUser({ matchPassword: jest.fn().mockResolvedValue(false) });
    const { req, res, next } = makeReqRes({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    User.findOne.mockResolvedValue(user);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('getProfile', () => {
  it('returns the authenticated user profile', async () => {
    const user = mockUser({ id: 7, name: 'Carol' });
    const { req, res, next } = makeReqRes({}, { id: 7 });
    User.findByPk.mockResolvedValue(user);

    await getProfile(req, res, next);

    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('returns 404 when the user no longer exists', async () => {
    const { req, res, next } = makeReqRes({}, { id: 999 });
    User.findByPk.mockResolvedValue(null);

    await getProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('updateProfile', () => {
  it('updates name and returns the updated profile', async () => {
    const user = mockUser({ id: 1, name: 'Old Name' });
    const { req, res, next } = makeReqRes({ name: 'New Name' }, { id: 1 });
    User.findByPk.mockResolvedValue(user);

    await updateProfile(req, res, next);

    expect(user.update).toHaveBeenCalledWith({ name: 'New Name' });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'mock-jwt-token' })
    );
  });

  it('returns 404 when the user does not exist', async () => {
    const { req, res, next } = makeReqRes({ name: 'Ghost' }, { id: 0 });
    User.findByPk.mockResolvedValue(null);

    await updateProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('only includes fields that are present in the request body', async () => {
    const user = mockUser();
    const { req, res, next } = makeReqRes({ avatar: 'https://example.com/avatar.png' }, { id: 1 });
    User.findByPk.mockResolvedValue(user);

    await updateProfile(req, res, next);

    expect(user.update).toHaveBeenCalledWith({ avatar: 'https://example.com/avatar.png' });
  });
});
