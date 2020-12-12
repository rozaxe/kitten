module.exports = {
    css: ['build/components.out.css', 'build/static/css/*.css'],
    content: ['build/index.html', 'build/static/js/*.js'],
    output: ['build'],
    safelist: {
        standard: [/^or-transition-/]
    },
    extractors: [
        {
            extractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
            extensions: ['html', 'js']
        }
    ]
}
