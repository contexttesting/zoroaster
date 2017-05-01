const errorMessage = 'When you are in doubt abstain.'

const testSuite = {
    context: {
        errorMessage,
    },
    test1: () => {},
    test2: (ctx) => { throw new Error(ctx.errorMessage) },
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
}

module.exports = testSuite
