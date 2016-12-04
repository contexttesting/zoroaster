/* eslint no-console: 0 */
const cp = require('child_process')
const path = require('path')

const zoroaster = path.join(__dirname, 'bin', 'zoroaster')
const spec = path.join(__dirname, 'test', 'spec')

// watch
if (process.argv.find(argv => argv === '--watch')) {
    cp.execFile('node', [zoroaster, spec, '--watch']).stdout.on('data', (d) =>  {
        console.log(d.toString().trim())
    })
} else {
    cp.execFile('node', [zoroaster, spec], (error, stdout, stderr) => {
        console.log(stdout.trim())
        console.log()
        if (error) {
            console.log(stderr)
            console.error(error)
            process.exit(1)
        }
    })
}
