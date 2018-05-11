const errorMessage = 'When you are in doubt abstain.'

const t = {
  context: {
    errorMessage,
  },
  test1() {},
  test2(ctx) { throw new Error(ctx.errorMessage) },
  async test3() {},
  test4: () => 'test result',
  async test5() {
    await new Promise(r => setTimeout(r, 100))
  },
  async test6() {
    await new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('Error from Promise constructor')),
        100,
      )
    })
  },
}

export default t
