const [,, ...rest] = process.argv
console.log('argv: "%s"', rest.join(' '))
console.log('Arguments: %s', JSON.stringify(rest))

console.error('zoroaster test mask')
process.exit(127)