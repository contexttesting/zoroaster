import { equal } from 'assert'
import { Readable } from 'stream'
import Catchment from 'catchment'
import { setupAnswers } from '../../../src/lib/mask/'

const ts = {
  async 'can setup answers'() {
    const rs = new Readable({
      read() {
        this.push('data: ')
        this.push('world: ')
        this.push(null)
      },
    })
    const c = new Catchment()
    const l = new Catchment()
    setupAnswers(rs, c, [
      [/data/, 'ok data'],
      [/world/, 'hello data'],
    ], l)
    rs.on('end', () => {
      c.end()
      l.end()
    })
    const cRes = await c.promise
    const lRes = await l.promise
    equal(cRes, `ok data
hello data
`)
    equal(lRes, `data: ok data
world: hello data
`)
  },
  async 'can setup answers without log'() {
    const rs = new Readable({
      read() {
        this.push('data: ')
        this.push('world: ')
        this.push(null)
      },
    })
    const c = new Catchment()
    setupAnswers(rs, c, [
      [/data/, 'ok data'],
      [/world/, 'hello data'],
    ])
    rs.on('end', () => {
      c.end()
    })
    const cRes = await c.promise
    equal(cRes, `ok data
hello data
`)
  },
  async 'works when answers are exhausted'() {
    const rs = new Readable({
      read() {
        this.push('data: ')
        this.push('thank you.')
        this.push(null)
      },
    })
    const c = new Catchment()
    const l = new Catchment()
    setupAnswers(rs, c, [
      [/data/, 'ok data'],
    ], l)
    rs.on('end', () => {
      c.end()
      l.end()
    })
    const cRes = await c.promise
    const lRes = await l.promise
    equal(cRes, `ok data
`)
    equal(lRes, `data: ok data
thank you.`)
  },
}

export default ts