export default async ({ host, port } = {} ) => {
  return { Network: {
    requestWillBeSent(){},
    enable(){},
  }, Page: { enable() {}, navigate(){ return 'hello world' } },
  Runtime: {},
  close(){},
  }
}