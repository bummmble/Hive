import express from 'express';
import createCore from './middleware/core';
import createError from './middleware/error';
import createFallback from './middleware/fallback';
import createSecurity from './middleware/security';

const defaultStatic = {
  public: '/static',
  path: 'build/client',
};

function addExtraMiddleware(server, middleware) {
  if (middleware.length > 0) {
    middleware.forEach((m) => {
      if (Array.isArray(m)) {
        server.use(...m);
      } else {
        server.use(m);
      }
    });
  }
}

export default function createServer({
  staticConfig = defaultStatic,
  afterSecurity = [],
  beforeFallback = [],
  enableNonce = false,
  enableCSP = false,
}) {
  const server = express();

  createError(server);
  createSecurity(server, { enableNonce, enableCSP });
  addExtraMiddleware(server, afterSecurity);
  createCore(server);

  if (staticConfig) {
    server.use(staticConfig.public, express.static(staticConfig.path));
  }

  addExtraMiddleware(server, beforeFallback);
  createFallback(server);

  return server;
}
