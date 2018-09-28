const rl = require('readline')

const i = rl.createInterface({
  input: process.stdin,
  output: process.stderr,
})
i.question('Answer 1: ', (a) => {
  console.log(a)
  process.exit(1)
})