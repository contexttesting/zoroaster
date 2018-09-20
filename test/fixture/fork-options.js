const [,, ...rest] = process.argv
process.stdout.write(JSON.stringify(rest))
process.stderr.write(process.env.FORK_ENV)