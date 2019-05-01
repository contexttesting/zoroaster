import { c } from 'erte'

export const ZOROASTER = process.env.ALAMODE_ENV == 'test-build' ? 'depack/bin/zoroaster' : 'src/bin'

console.log('Testing %s', c(ZOROASTER, 'blue'))

const re = new RegExp(process.cwd().replace(/\\/g, '\\\\'), 'g')
const winRe = new RegExp(process.cwd().replace(/\\/g, '/'), 'g')

export function getSnapshot(s) {
  return s
    .replace(re, '')
    .replace(winRe, '')
    .replace(/\\/g, '/')
    .replace(/\r?\n/g, '\n')
}

export function preprocessStderr(stderr) {
  if (stderr.startsWith('Reverting JS')) {
    const [,,,...rest] = stderr.split('\n')
    const se = rest.join('\n')
    return se
  }
  return stderr
}