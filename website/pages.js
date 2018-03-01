const fs = require('fs')
const path = require('path')
const APP_DIR = path.join(__dirname, './app')
const PAGES_DIR = path.join(APP_DIR, './pages')
const BUILD_DIR = path.join(__dirname, './build')

module.exports = {
    layout: path.join(APP_DIR, 'layout/main.html'),
    appDir: APP_DIR,
    pagesDir: PAGES_DIR,
    pagesConf: path.join(__dirname, 'pages.json'),
    pre: [
        {
            re: /{{ navigation }}/,
            replacement: String(fs.readFileSync(path.join(APP_DIR, 'layout/navigation.html'))),
        },
        {
            re: /{{ company }}/g,
            replacement: '[Splendid](https://splendid.sh)',
        },
    ],
    pages: [
        {
            title: 'Main Page',
            url: 'index.html',
            file: 'index.md',
        },
        {
            title: 'Markdown',
            url: 'markdown.html',
            file: 'markdown.md',
        },
        {
            title: 'HighlightJS',
            url: 'highlightjs.html',
            file: 'highlightjs.md',
        },
    ],
    postProcess: [
        {
            re: /{{ year }}/g,
            replacement: `${new Date().getFullYear()}`,
        },
    ],
    output: BUILD_DIR,
}

