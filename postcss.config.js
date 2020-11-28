module.exports = {
    css: ['build/static/css/*.css'],
    content: ['build/index.html build/static/js/*.js'],
    output: ['build/static/css'],
    safelist: {
        standard: [/^or-transition-/]
    }
}