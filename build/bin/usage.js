let usually = require('usually'); if (usually && usually.__esModule) usually = usually.default;

module.exports=(usage) => {
  const res = usually({
    usage,
    description: `A testing framework with support for test contexts and masks.
Automatically transpiles import/export and JSX with ÀLaMode.
https://artdecocode.com/zoroaster/`,
    line: 'zoroaster path [pathN] [-w] [-ab] [-sr] [-vh]',
    example: 'zoroaster test/spec test/mask -a',
  })
  return res
}