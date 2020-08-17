let gulp = require('gulp')
let browserSync = require('browser-sync').create();
let sass = require('gulp-sass');

gulp.task('sass', () => {
    return gulp.src(['scss/alfbootstrap.scss', './scss/main.scss'])
        .pipe(sass())
        .pipe(gulp.dest('static/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('static/js'))
        .pipe(browserSync.stream());
});

gulp.task('serve', gulp.series('sass', () => {
    //browserSync.init({server: './static'});
    gulp.watch('scss/*', gulp.series('sass'));
}));

gulp.task('default', gulp.series('js', 'serve'));
