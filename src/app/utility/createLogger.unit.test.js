import createLogger from './createLogger';

test('createLogger returns winston logger instance', async () => {
  const logger = await createLogger();

  expect(logger).toHaveProperty('info', 'warn', 'error');
});
