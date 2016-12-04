const errorMessage = 'When you are in doubt abstain.'

const test_suite = {
    test1: () => {},
    test2: () => { throw new Error(errorMessage)},
    test3: () => Promise.resolve(),
    test4: () => 'test result',
}

module.exports = test_suite
