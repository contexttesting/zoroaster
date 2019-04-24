import write from '@wrote/write'
import read from '@wrote/read'
import { askSingle } from 'reloquent'

const PATH = 'CHANGELOG.md'

;(async () => {
  const r = await read('package.json')
  const { version, repository } = JSON.parse(r)
  let { url: git } = repository
  git = git.replace(/^git:\/\//, 'https://').replace(/\.git$/, '')

  const next = await askSingle(`What is the next version after ${version}?`)
  const current = await read(PATH)
  const d = new Date()
  const m = d.toLocaleString('en-GB', { month: 'long' })
  const dd = `${d.getDate()} ${m} ${d.getFullYear()}`
  const heading = `## ${dd}`
  const t = `${heading}

### [${next}](${git}/compare/v${version}...v${next})

${current.startsWith(heading) ? current.replace(`${heading}\n\n`, '') : current}`
  await write(PATH, t)
})()

// ## 17 March 2019

// ### [3.9.0](https://github.com/contexttesting/zoroaster/compare/v3.8.5...v3.9.0)