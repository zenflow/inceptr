const pMemoize = require('p-memoize')
const path = require('path')
const { readFile } = require('./utils')

async function inspectReadme(cwd) {
  const str = await readFile(path.join(cwd, 'README.md'))
  const [first, second] = str
    .split(/\r?\n/)
    .slice(0, 4)
    .filter(Boolean)
  return {
    title: first.replace(/^#* /, '').trim(),
    subtitle: second.replace(/^#* /, '').trim(),
  }
}

module.exports = pMemoize(inspectReadme)
