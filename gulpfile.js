let gulp = require('gulp')
let browserSync = require('browser-sync').create();
let sass = require('gulp-sass');
let browserify = require('browserify');
let tsify = require('tsify');
let source = require('vinyl-source-stream');
let babelify = require('babelify');
let plumber = require('gulp-plumber');
let webpack = require('webpack-stream');
let rename = require('gulp-rename');
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

gulp.task('pack', () => {
    return gulp.src('client/vue/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('static/js/'));
});

/// DO NOT Use
gulp.task('browserify', () => {
    let b = browserify({
        debug: !env.p,
        basedir: "./client",
        entries: ["vue/index.js"],
        cache: {},
        transform: [
            'vueify',
            babelify.configure({
                presets: ['@babel/preset-env', '@babel/preset-react']
            })
        ],
        sourceType: 'module'
    });

    return b.plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("static/js"))
});

gulp.task('serve-sass', gulp.series('sass', () => {
    //browserSync.init({server: './static'});
    gulp.watch('scss/*', gulp.series('sass'));
}));

gulp.task('serve-vue', gulp.series('pack', () => {
    gulp.watch('client/vue', gulp.series('pack'));
}));


gulp.task('default', gulp.parallel('js', 'serve-sass', 'serve-vue'));
