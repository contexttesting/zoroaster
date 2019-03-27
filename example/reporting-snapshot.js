import TempContext from 'temp-context'

(async () => {
  const t = new TempContext()
  t._TEMP = 'example/reporting'
  const s = await t.snapshot()
  console.log(s)
})()