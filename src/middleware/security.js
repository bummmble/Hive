import helmet from 'helmet';
import parameterProtection from 'hpp';
import uuid from 'uuid';

export default function createSecurity(
  server,
  { enableNonce = true, enableCSP = true }
) {
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
