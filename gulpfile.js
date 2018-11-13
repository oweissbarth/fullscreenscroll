const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');


gulp.task('typescript', function () {
    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'fullscreenscroll.js'
        }))
        .pipe(sourcemaps.write())
        .pipe(minify({ext:{min: '.min.js'}}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('default', gulp.parallel('typescript'));
