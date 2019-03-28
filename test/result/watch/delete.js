// does not throw when file is deleted
import rm from '@wrote/rm'
import { confirm } from 'reloquent'

export default {
  async 'deletes watched file'() {
    await confirm('Delete file?')
    await rm(process.env.TEST_SUITE_PATH)
  },
}

/* support */
import { confirm } from 'reloquent'
export const support = {
  async 'support'() {
    const res = await confirm('Exit?')
    if (res) process.exit(0)
  },
}
/**/

/* stderr */
Test suite file test/temp/test.js was deleted.
/**/

/* stdout */
 test/temp/test.js
Delete file (y/n)? [y] y
  ✓  deletes watched file
 test/temp/support.js
   support
Exit (y/n)? [y] n
    ✓  support

🦅  Executed 2 tests.
 test/temp/support.js
   support
Exit (y/n)? [y] y
/**/