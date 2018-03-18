const pMemoize = require('p-memoize')
const { simpleShell } = require('./utils')

async function inspectGit(cwd) {
  const [url, userName, userEmail] = await Promise.all(
    [
      'git remote get-url origin',
      'git config user.name',
      'git config user.email',
    ].map(cmd => simpleShell(cwd, cmd)),
  )
  return {
    url: url.replace(/^git\+/, '').replace(/\.git$/, ''),
    userName,
    userEmail,
  }
}

module.exports = pMemoize(inspectGit)
