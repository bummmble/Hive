/* eslint-disable no-underscore-dangle */

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex.default : ex;
}

const express = _interopDefault(require('express'));
const cookieParser = _interopDefault(require('cookie-parser'));
const PrettyError = _interopDefault(require('pretty-error'));
const helmet = _interopDefault(require('helmet'));
const parameterProtection = _interopDefault(require('hpp'));
const uuid = _interopDefault(require('uuid'));

function createCore(server) {
  server.use(cookieParser());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
}

const pretty = new PrettyError();

pretty.skipNodeFiles();
pretty.skipPackage('express');

function createError(server) {
  server.use((err, req, res, next) => {
    console.log(pretty.render(err));
    next();
  });
}

function createFallback(server) {
  /** Handle 404 Errors
     * Note: If doing isomorphic rendering with something like
     * Universal Component it will handle 404 paths, but it is good
     * to have this backup for paths that are not handled by the universal
     * middleware
     */

  server.use((req, res) => {
    res.status(404).send('Sorry, that resource was not found');
  });

  // Handle all other errors
  // Note: All 4 params must be specified on the callback even if
  // they are not being used, otherwise this won't be called

  // eslint-disable-next-line no-unused-vars
  server.use((err, req, res, next) => {
    if (err) {
      console.log(err);
      console.log(err.stack);
    }

    res.status(500).send('Sorry, an unexpected error occurred');
  });
}

function createSecurity(server, { enableNonce = true, enableCSP = true }) {
  if (enableNonce) {
    server.use((req, res, next) => {
      res.locals.nonce = uuid();
      next();
    });
  }

  // Don't expose software information
  server.disable('x-powered-by');

  // Prevent HTTP Parameter pollution
  server.use(parameterProtection());

  // Sets X-XSS-Protection header to prevent reflected XSS attacks
  server.use(helmet.xssFilter());

  // Mitigates clickjacking attacks by setting the X-Frame-Options header
  server.use(helmet.frameguard('deny'));

  server.use(helmet.ieNoOpen());
  server.use(helmet.noSniff());

  // Content Security Policy (CSP)
  //
  // - https://content-security-policy.com
  // - https://developers.google.com/web/fundamentals/security/csp/
  // - https://helmetjs.github.io/docs/csp/
  //
  // If you are relying on assets from other servers, then you will
  // need to explicitly configure the CSP to allow for this.
  const cspConfig = enableCSP
    ? {
      directives: {
        defaultSrc: ['"self"'],
        scriptSrc: [
          // Allow self-hosted scripts
          '"self"',

          // Execute inline scripts that have nonces attached
          // This is useful for protecting the application while allowing
          // an inline script to do data store rehydration (redux/mobx/apollo)
          (req, res) => `'nonce-${res.locals.nonce}'`,

          // Required for eval-source-maps
          process.env.NODE_ENV === 'development'
            ? '"unsafe-eval"'
            : '',
        ].filter(value => value !== ''),
        styleSrc: ['"self"', '"unsafe-inline"', 'blob:'],
        imgSrc: ['"self"', 'data:'],
        fontSrc: ['"self"', 'data:'],

        // Setting this to any stricter breaks service workers.
        // I'm not sure how to get around this
        connectSrc: ['*'],
        childSrc: ['"self"'],
      },
    }
    : null;

  if (enableCSP) {
    server.use(helmet.contentSecurityPolicy(cspConfig));
  }
}

const defaultStatic = {
  public: '/static',
  path: 'build/client',
};

function createServer({
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

exports.createServer = createServer;
