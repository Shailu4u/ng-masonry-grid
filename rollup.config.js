export default {
    input: 'dist/index.js',    
    output: {
        file: 'dist/bundles/masonry-grid.module.umd.js',
        sourcemap: true,
        format: 'umd',
        name: 'MasonryGridModule',
        globals: {
            '@angular/core': 'ng.core',
            '@angular/common': 'ng.common',
            'desandro-classie': 'classie',
            'masonry-layout': 'Masonry'
        }
    },
    external: ['masonry-layout','desandro-classie','@angular/core','@angular/common'],
    
}