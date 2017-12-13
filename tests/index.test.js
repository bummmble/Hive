import test from 'ava';
import { createServer } from '../src/index';
/* eslint-disable no-underscore-dangle */
function getLayers(server) {
  return server._router.stack.map(layer => layer.name);
}

function testMiddleware(req, res, next) {
  return next();
}

test('Should create an express app', (t) => {
  const server = createServer({});
  const names = getLayers(server);
  t.true(names.includes('hpp'));
  t.true(names.includes('xXssProtection'));
  t.true(names.includes('frameguard'));
  t.true(names.includes('ienoopen'));
  t.true(names.includes('nosniff'));
  t.true(names.includes('cookieParser'));
  t.true(names.includes('jsonParser'));
  t.true(names.includes('serveStatic'));
});

test('Server should have x-powered-by setting disabled', (t) => {
  const server = createServer({});
  const { settings } = server;
  t.true(settings['x-powered-by'] === false);
});

test('Should add afterSecurity middleware', (t) => {
  const server = createServer({
    afterSecurity: [testMiddleware],
  });
  const names = getLayers(server);
  t.true(names.includes('testMiddleware'));
});

test('Should add beforeFallback middleware', (t) => {
  const server = createServer({
    beforeFallback: [testMiddleware],
  });
  const names = getLayers(server);
  t.true(names.includes('testMiddleware'));
});

test('Should add property CSP', t => {
    const server = createServer({
        enableCSP: true,
        enableNonce: true
    });
    const names = getLayers(server);
    t.true(names.includes('csp'));
})
