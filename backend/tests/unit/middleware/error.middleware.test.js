const { notFound, errorHandler } = require('../../../middleware/error.middleware');

describe('notFound', () => {
  it('sets status 404 and calls next with an error containing the URL', () => {
    const req = { originalUrl: '/not-a-real-path' };
    const res = { status: jest.fn().mockReturnThis() };
    const next = jest.fn();

    notFound(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('/not-a-real-path');
  });
});

describe('errorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      statusCode: 200,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('defaults to 500 when res.statusCode is 200', () => {
    const err = new Error('Unexpected failure');
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Unexpected failure' })
    );
  });

  it('preserves non-200 status codes from the response', () => {
    res.statusCode = 404;
    const err = new Error('Resource not found');
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('maps SequelizeUniqueConstraintError to 400', () => {
    const err = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'email must be unique' }],
    };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'email must be unique' })
    );
  });

  it('joins multiple SequelizeUniqueConstraintError messages', () => {
    const err = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'email must be unique' }, { message: 'username must be unique' }],
    };
    errorHandler(err, req, res, next);
    expect(res.json.mock.calls[0][0].message).toBe(
      'email must be unique, username must be unique'
    );
  });

  it('maps SequelizeValidationError to 400 with joined messages', () => {
    const err = {
      name: 'SequelizeValidationError',
      errors: [{ message: 'Name is required' }, { message: 'Invalid email format' }],
    };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toBe('Name is required, Invalid email format');
  });

  it('hides stack trace in production', () => {
    const savedEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const err = new Error('prod error');
    err.stack = 'secret stack trace';
    errorHandler(err, req, res, next);
    expect(res.json.mock.calls[0][0].stack).toBeNull();
    process.env.NODE_ENV = savedEnv;
  });

  it('includes stack trace outside production', () => {
    process.env.NODE_ENV = 'test';
    const err = new Error('dev error');
    err.stack = 'visible stack trace';
    errorHandler(err, req, res, next);
    expect(res.json.mock.calls[0][0].stack).toBeTruthy();
  });
});
