import usually from 'usually'
import { reduceUsage } from 'argufy'
import { argsConfig } from './get-args'

export default () => {
  const usage = reduceUsage(argsConfig)
  const res = usually({
    usage,
    description: `A context-testing framework with support for mask and fork-testing.
Automatically transpiles import/export and JSX with ÀLaMode.
https://www.contexttesting.com`,
    line: 'zoroaster path [pathN] [-w] [-a [-e env]] [-sr] [-vh]',
    example: 'zoroaster test/spec test/mask -a',
  })
  return res
}