const errorMessage = 'When you are in doubt abstain.'

const test_suite = {
    test1: () => {},
    test2: () => { throw new Error(errorMessage)},
    test3: () => Promise.resolve(),
    test4: () => 'test result',
    test5: () => new Promise(resolve => {
        setTimeout(resolve, 100)
    }),
    test6: () => new Promise((_, reject) => {
        setTimeout(() =>
            reject(new Error('Error from Promise constructor'))
        , 100)
    }),
    test7: () => new Promise((resolve) => {}),
}

module.exports = test_suite
