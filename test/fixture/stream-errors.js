import { Transform } from 'stream'

const reduce = () => {
  return ['abc'].reduce(async (acc) => {
    await acc
    console.log('throwing error')
    throw new Error('error')
  }, {})
}

export default {
  context: { reduce },
  'handles unhandled rejections'({ reduce: asyncMethod }) {
    const t = new Transform({
      async transform() {
        await asyncMethod()
      },
    })
    t.end('test')
    return t
  },
  'handles rejections'({ reduce: asyncMethod }) {
    const t = new Transform({
      async transform(a, b, c) {
        try {
          await asyncMethod()
        } catch (err) {
          console.log('emitting error')
          c(err)
        }
      },
    })
    t.end('test')
    return t
  },
}