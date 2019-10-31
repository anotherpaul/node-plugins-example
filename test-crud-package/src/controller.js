function createController({ base, logger }) {
  async function create(payload) {
    const result = await base.create(payload);
    logger.log('here is your custom logic, bro', payload);
    return result;
  }

  return {
    create,
  };
}

module.exports = createController;
