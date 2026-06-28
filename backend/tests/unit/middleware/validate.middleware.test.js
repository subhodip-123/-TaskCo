const { validationResult } = require('express-validator');
const validate = require('../../../middleware/validate.middleware');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('validate middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('calls next() when there are no validation errors', () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    validate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with joined error messages when validation fails', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { msg: 'Name is required' },
        { msg: 'Invalid email' },
      ],
    });
    validate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Name is required, Invalid email' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('includes the raw errors array in the response', () => {
    const errArray = [{ msg: 'Password too short', param: 'password' }];
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errArray,
    });
    validate(req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: errArray })
    );
  });
});
