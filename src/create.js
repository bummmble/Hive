import express from 'express';
import createCore from './middleware/core';
import createError from './middleware/error';
import createFallback from './middleware/fallback';
import createSecurity from './middleware/security';

const defaultStatic = {
  public: '/static',
  path: 'build/client',
};

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

  if (afterSecurity.length > 0) {
    afterSecurity.forEach((middleware) => {
      if (Array.isArray(middleware)) {
        server.use(...middleware);
      } else {
        server.use(middleware);
      }
    });
  }

  createCore(server);

  if (staticConfig) {
    server.use(staticConfig.public, express.static(staticConfig.path));
  }

  if (beforeFallback.length > 0) {
    afterSecurity.forEach((middleware) => {
      if (Array.isArray(middleware)) {
        server.use(...middleware);
      } else {
        server.use(middleware);
      }
    });
  }

  createFallback(server);

  return server;
}
