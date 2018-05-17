let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
gulp.task('css',function(){
    gulp.src('src/css/*.css')
    .pipe(autoprefixer({
        browsers:['last 2 versions']
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('images', function(){
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

gulp.task('js',function(){
    gulp.src(['./src/js/resources.js', './src/js/app.js', './src/js/engine.js'])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
});


gulp.task('cssMinify', function() {
    gulp.src('./src/css/**/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./dist/css/'))
});

gulp.task('watchCssfiles', function() {
    gulp.watch('./src/css/*.css', ['cssMinify'])
});

gulp.task('default',['css','js','images','watchCssfiles'])