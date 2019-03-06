import render from '@depack/render'

const App = ({children}) => {
  return (<div>
    {children}
    Tested By Depack
  </div>)
}

export default {
  async 'asyncTest'() {
    const res = await render(<App>
      <h1>Hello World</h1>
    </App>)
    process.stderr.write(res)
  },
}