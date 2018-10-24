const ask = require('reloquent')

;(async () => {
  const { t, t2 } = await ask({
    t: {
      text: 'Answer 1',
    },
    t2: {
      text: 'Answer 2',
    },
  })
  console.error(t)
  console.error(t2)
})()