require('alamode')()
import { askSingle } from 'reloquent'

(async () => {
  await askSingle('What is your name?')
  await askSingle('come again')
  await askSingle('call it again')
  await askSingle('spell em')
})()