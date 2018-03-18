const path = require('path')
const {
  myShell,
  logWrapTask,
  writeFile,
  writeJson,
} = require('./utils')
const inspectReadme = require('./inspectReadme')
const inspectGit = require('./inspectGit')
const inspectLicense = require('./inspectLicense')

async function inceptr({ log, cwd, args }) {
  log = log.bind(null, 'inceptr:')
  const task = logWrapTask.bind(null, log)
  const shell = myShell.bind(null, log, cwd)

  const [readme, git, license] = await task(
    'inspecting files',
    Promise.all([inspectReadme(cwd), inspectGit(cwd), inspectLicense(cwd)]),
  )

  const pkg = {
    name: readme.title,
    description: readme.subtitle,
    version: '1.0.0',
    repository: {
      type: 'git',
      url: `git+${git.url}.git`,
    },
    author: {
      name: git.userName,
      email: git.userEmail,
    },
    license: license.license,
    bugs: {
      url: `${git.url}/issues`,
    },
    homepage: `${git.url}#readme`,
  }

  // TODO: pkg fields: keywords, scripts

  await task(
    `writing package.json`,
    writeJson(path.join(cwd, 'package.json'), pkg),
  )

  const gitignore = ['node_modules/', 'package-lock.json'].join('\n') + '\n'
  await task(
    `writing .gitignore`,
    writeFile(path.join(cwd, '.gitignore'), gitignore),
  )

  await task(
    `installing zenflow-lint-js`,
    async () => {
      await shell('npm install zenflow-lint-js')
      await shell('npx zenflow-lint-js setup')
      await shell('npm run fix').catch(error => null)
    },
  )

  log('done')
}

module.exports = inceptr
