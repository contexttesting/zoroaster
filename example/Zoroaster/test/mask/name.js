import { makeTestSuite } from '../../../../src'

const name = 'Ovuvuevuevue enyetuenwuevue ugbemugbem osas'

const ts = makeTestSuite('example/Zoroaster/test/result/name.md', {
  fork: {
    module: 'example/Zoroaster/test/fixture/ask-name',
    inputs: [
      [/What is your name/, name],
      [/come again/, name],
      [/call it again/, name],
      [/spell em/, name],
    ],
    log: true,
  },
  mapActual({ stdout }) {
    return stdout.trim()
  },
})

export default ts