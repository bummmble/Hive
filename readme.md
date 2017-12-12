[![CircleCI](https://circleci.com/gh/bummmble/Hive.svg?style-svg)](https://circleci.com/gh/bummmble/Hive)
[![Maintainability](https://api.codeclimate.com/v1/badges/3acc284e618da936f65a/maintainability)](https://codeclimate.com/github/bummmble/Hive/maintainability)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

# Hive

Hive is a centralized, Express HTTP Server to be used as a starting point for building modern applications.

## Installation
Install with the package manager of your choice easily. NPM is used below

```
npm install -S bummmble-hive
```

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
