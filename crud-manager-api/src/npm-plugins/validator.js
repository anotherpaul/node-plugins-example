const joi = require('joi');

const packageSchema = joi
  .object({
    body: joi.object().keys({
      name: joi.string().required(),
    }),
    file: joi
      .object()
      .keys({
        filename: joi.string().required(),
      })
      .unknown(),
  })
  .unknown();

function packageValidator(req, res, next) {
  const result = joi.validate(req, packageSchema);
  if (result.error) {
    return res.status(400).send(result.error.details);
  }
  return next();
}

module.exports = packageValidator;
