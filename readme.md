[![CircleCI](https://circleci.com/gh/bummmble/Hive.svg?style-svg)](https://circleci.com/gh/bummmble/Hive)

# Hive

Hive is a centralized, Express HTTP Server to be used as a starting point for building modern applications.

## Features

- A solid foundation for starting an Express project
- Easily extensible and customizable middleware
- Pretty Error handling via [Pretty Error](https://github.com/AriaMinaei/pretty-error)
- A focus on security utilizing [hpp](https://github.com/analog-nico/hpp) and [Helmet](https://github.com/helmetjs/helmet)

## Api

### createServer

Takes some configuration and returns an Express Application instance

```js
const server = createServer({
    // Static config determines where you want to serve your files from
    // public: is where the files are located
    // path: is your static path to request
    staticConfig: {
        public: 'build/client',
        path: '/static'
    },

    // After security takes an array of middleware to be added after the security middleware is added
    afterSecurity: [],

    // Before fallback functions the same as afterSecurity, but adds the middleware after the fallback middleware near the end
    afterFallback: [],

    // A boolean that determines whether a unique nonce should be added to the response object
    enableNonce: false

    // A boolean that determines whether Content Security Policy should be enabled
    enableCSP: false
});
```
