let gulp = require('gulp')
let sass = require('gulp-sass');
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

gulp.task('pack', () => {
    return gulp.src('client/vue/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('static/js/'));
});

gulp.task('serve-sass', gulp.series('sass', () => {
    gulp.watch('scss/*', gulp.series('sass'));
}));

gulp.task('serve-vue', gulp.series('pack', () => {
    gulp.watch('client/vue', gulp.series('pack'));
}));


gulp.task('default', gulp.parallel('js', 'serve-sass', 'serve-vue'));
