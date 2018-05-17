let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');

gulp.task('css',function(){
    gulp.src('src/css/*.css')
    .pipe(autoprefixer({
        browsers:['last 2 versions']
    }))
    
    .pipe(gulp.dest('dist/css/'))
});