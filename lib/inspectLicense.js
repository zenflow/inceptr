const pMemoize = require('p-memoize')
const path = require('path')
const { readFile } = require('./utils')

async function inspectLicense(cwd) {
  const licenseData = await readFile(path.join(cwd, 'LICENSE'))
  const line = licenseData.split(/\r?\n/)[0]
  const license =
    (/MIT/i.test(line) && 'MIT') ||
    (/GNU|GPL/i.test(line) && 'GPL') ||
    (/CC/i.test(line) && 'CC') ||
    (/ISC/i.test(line) && 'ISC') ||
    line
  return { license }
}

module.exports = pMemoize(inspectLicense)
