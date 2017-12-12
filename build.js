/* eslint-disable import/no-extraneous-dependencies */
const { rollup } = require('rollup');
const exec = require('rollup-plugin-exec');
const builtinModules = require('builtin-modules');
const args = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat(builtinModules);

function getFormat() {
  if (args.cli || args.cjs) {
    return 'cjs';
  }
  return 'es';
}

function getOutput() {
  if (args.cli) {
    return 'bin/hive';
  } else if (args.es) {
    return 'dist/index.es.js';
  }
  return 'dist/index.cjs.js';
}

function build() {
  const format = getFormat();
  const dest = getOutput();

  return rollup({
    entry: 'src/index.js',
    external,
    plugins: args.cli ? [exec()] : [],
  })
    .then(({ write }) =>
      write({
        dest,
        format,
        banner: args.cli ? '#!/usr/bin/env node\n' : '',
      }))
    .then(() => console.log('Hive built'))
    .catch(err => console.error(err));
}

build();
