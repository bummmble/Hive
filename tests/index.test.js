import test from 'ava';
import { createServer } from '../src/index';

/* eslint-disable no-underscore-dangle */
test('Should create an express app', (t) => {
  const server = createServer({});
  const layers = server._router.stack;
  const names = layers.map(layer => layer.name);
  t.true(names.includes('hpp'));
  t.true(names.includes('xXssProtection'));
  t.true(names.includes('frameguard'));
  t.true(names.includes('ienoopen'));
  t.true(names.includes('nosniff'));
  t.true(names.includes('cookieParser'));
  t.true(names.includes('jsonParser'));
});

test('Server should have x-powered-by setting disabled', (t) => {
  const server = createServer({});
  const { settings } = server;
  t.true(settings['x-powered-by'] === false);
});
