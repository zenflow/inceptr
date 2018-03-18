#!/usr/bin/env node

const minimist = require('minimist')
const inceptr = require('./lib/inceptr')

inceptr({
  log: console.log,
  cwd: process.cwd(),
  args: Object.assign(
    {
      /* options */
    },
    minimist(process.argv.slice(2)),
  ),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
