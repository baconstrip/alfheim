let gulp = require('gulp')
let browserSync = require('browser-sync').create();
let sass = require('gulp-sass');
let browserify = require('gulp-browserify');
let rename = require('gulp-rename');
let plumber = require('gulp-plumber');
let uglify = require('gulp-uglify');
let gulpif = require('gulp-if');
const { env } = require('process');

gulp.task('sass', () => {
    return gulp.src(['scss/alfbootstrap.scss', './scss/main.scss'])
        .pipe(sass())
        .pipe(gulp.dest('static/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src([
            'node_modules/bootstrap/dist/js/bootstrap.min.js', 
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/vue/dist/vue.js'
        ])
        .pipe(gulp.dest('static/js'))
        .pipe(browserSync.stream());
});

gulp.task('browserify', () => {
    return gulp.src('client/vue/main.vue')
        .pipe(plumber())
        .pipe(browserify({
            debug: !env.p,
            transform: ['vueify']
        }))
        .pipe(gulpif(env.p, uglify()))
        .pipe(rename({
            extname: ".js"
        }))
        .pipe(gulp.dest('static/js'));
});

gulp.task('serve-sass', gulp.series('sass', () => {
    //browserSync.init({server: './static'});
    gulp.watch('scss/*', gulp.series('sass'));
}));

gulp.task('serve-vue', gulp.series('browserify', () => {
    gulp.watch('client/vue', gulp.series('browserify'));
}));


gulp.task('default', gulp.parallel('js', 'serve-sass', 'serve-vue'));
