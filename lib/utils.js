const execa = require('execa')
const { promisify } = require('util')
const fs = require('fs')

const myShell = (log, cwd, cmd) => {
  log(`${cwd}$ ${cmd}\n`)
  const child = execa.shell(cmd, { cwd })
  child.stdout.pipe(process.stdout)
  process.stdin.pipe(child.stdin)
  return child
}

const simpleShell = (cwd, cmd) =>
  execa.shell(cmd, { cwd }).then(({ stdout }) => stdout)

const logWrapTask = (log, verb, promiseOrThunk) => {
  log(`${verb}...`)
  const promise =
    typeof promiseOrThunk === 'function' ? promiseOrThunk() : promiseOrThunk
  return promise.then(result => {
    log(`done ${verb}.`)
    return result
  })
}

const fsReadFile = promisify(fs.readFile)
const readFile = file => fsReadFile(file, 'utf8')
const writeFile = promisify(fs.writeFile)
const writeJson = (file, data) =>
  writeFile(file, JSON.stringify(data, null, 2) + '\n')

module.exports = {
  myShell,
  simpleShell,
  logWrapTask,
  readFile,
  writeFile,
  writeJson,
}
