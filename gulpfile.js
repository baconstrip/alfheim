let gulp = require('gulp');
let typedoc = require('gulp-typedoc');
let sass = require('gulp-sass')(require('sass'));
let webpack = require('webpack-stream');
let rename = require('gulp-rename');


gulp.task('sass', () => {
    return gulp.src(['scss/alfbootstrap.scss', './scss/main.scss'])
        .pipe(sass())
        .pipe(gulp.dest('static/css'));
});

gulp.task('js', () => {
    return gulp.src([
            'node_modules/bootstrap/dist/js/bootstrap.min.js', 
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/vue/dist/vue.js'
        ])
        .pipe(gulp.dest('static/js'));
});

gulp.task('game-pack', () => {
    return gulp.src('client/vue/game/index.js')
        .pipe(webpack(require('./webpack-game.config.js')))
        .pipe(rename('game.js'))
        .pipe(gulp.dest('static/js/'));
});

gulp.task('pages-pack', () => {
    return gulp.src('client/vue/webpages/index.js')
        .pipe(webpack(require('./webpack-webpages.config.js')))
        .pipe(rename('webpages.js'))
        .pipe(gulp.dest('static/js/'));
});

gulp.task('typedoc', () => {
    return gulp.src(["client/*"]).pipe(
        typedoc({
            out: "docs/api",
            name: "Alfheim docs"
        })
    );
})

gulp.task('serve-sass', gulp.series('sass', () => {
    gulp.watch('scss/*', gulp.series('sass'));
}));

gulp.task('serve-game', gulp.series('game-pack', () => {
    gulp.watch('client/vue', gulp.series('game-pack'));
}));
gulp.task('serve-pages', gulp.series('pages-pack', () => {
    gulp.watch('client/vue', gulp.series('pages-pack'));
}));


gulp.task('default', gulp.parallel('js', 'serve-sass', 'serve-game', 'serve-pages'));
