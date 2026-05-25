const { validationResult } = require('express-validator');

/**
 * Middleware to run after express-validator checks.
 * Use in routes like: [check('email').isEmail(), validateRequest]
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = validateRequest;
