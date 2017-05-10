const assert = require('assert')
const Test = require('../../src/test')

const name = 'The higher we soar the smaller we appear to those who cannot fly.'
const fn = () => {}
const errorMessage = 'When you are in doubt abstain.'

const Test_test_suite = {
    instance: {
        'should set the name': () => {
            const test = new Test(name, fn)
            assert(test.name === name)
        },
        'should set the function': () => {
            const test = new Test(name, fn)
            assert(test.fn === fn)
        },
        'should set variables to null': () => {
            const test = new Test(name, fn)
            assert(test.started === null)
            assert(test.finished === null)
            assert(test.error === null)
            assert(test.result === null)
        },
        timeout: {
            'should have a default timeout': () => {
                const test = new Test(name, fn)
                assert(test.timeout === 2000)
            },
            'should set a timeout': () => {
                const timeout = 1000
                const test = new Test(name, fn, timeout)
                assert(test.timeout === timeout)
            },
        },
        'should have the run method': () => {
            const test = new Test(name, fn)
            assert(typeof test.run === 'function')
        },
    },
    runTest: {
        'should timeout test after specified timeout': () => {
            const timeout = 100
            const fn = () => {
                return new Promise((resolve) => {
                    setTimeout(resolve, timeout + 100)
                })
            }
            const test = new Test(name, fn, timeout)
            return test.run()
                .then(() => {
                    assert(test.hasErrors())
                    const expectedMsg = `Test has timed out after ${timeout}ms`
                    assert(test.error.message === expectedMsg)
                })
        },
        'should run a test': () => {
            const test = new Test(name, fn)
            const res = test.run()

            assert(res instanceof Promise)
            assert(test.started !== null)
            return res
                .then(() => {
                    assert(test.error === null)
                    assert(test.result === undefined)
                    assert(test.finished !== null)
                })
        },
        'should save result of a test': () => {
            const result = 'test_string_result'
            const test = new Test(name, () => result)
            const res = test.run()

            return res
                .then(() =>
                    assert(test.result === result)
                )
        },
        'should run a test with an error': () => {
            const test = new Test(name, () => {
                throw new Error(errorMessage)
            })
            const res = test.run()

            return res.then(() => {
                assert(test.result === null)
                assert(test.error !== null)
                assert(test.error.message === errorMessage)
                assert(test.result === null)
            })
        },
    },
    hasErrors: {
        'should report as having an error': () => {
            const test = new Test(name, () => {
                throw new Error(errorMessage)
            })
            return test.run()
                .then(() =>
                    assert(test.hasErrors())
                )
        },
        'should report as not having an error': () => {
            const test = new Test(name, () => {})
            return test.run()
                .then(() =>
                    assert(!test.hasErrors())
                )
        },
    },
}

module.exports = Test_test_suite
