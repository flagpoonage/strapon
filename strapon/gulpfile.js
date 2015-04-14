var gulp = require('gulp');
var sass = require('gulp-sass');
var lint = require('gulp-jshint');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var cssmin = require('gulp-minify-css');

gulp.task('clean-script', function(){
	return gulp.src('public/scripts/**/*.{js,map}')
			   .pipe(clean());
});

gulp.task('clean-style', function(){
	return gulp.src('public/style/**/*.{css,map}')
			   .pipe(clean());
});

gulp.task('clean-html', function(){
	return gulp.src('public/*.html')
			   .pipe(clean());
});

gulp.task('html', ['clean-html'], function(){
	gulp.src('src/html/**/*.html')
		.pipe(plumber())
		.pipe(gulp.dest('public'));
});

gulp.task('script', ['clean-script'], function(){
	var src = 'src/script/strapon/';
	var sourceify = function(vals){
		for(var i = 0; i < vals.length; i++){
			vals[i] = src + vals[i];
		}
		return vals;
	};

	gulp.src('src/script/strapon/strapon-all.js')
		.pipe(plumber())
		.pipe(concat('strapon.js'))
		.pipe(gulp.dest('public/script'))
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('public/script'));

	gulp.src('src/script/app/**/*.js')
		.pipe(concat('app.js'))
		.pipe(gulp.dest('public/script'))
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('public/script'));
});

gulp.task('style', ['clean-style'], function(){
	gulp.src('src/style/**/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('public/style'))
		.pipe(cssmin())
		.pipe(rename({ extname: '.min.css'}))
		.pipe(gulp.dest('public/style'));
})

gulp.task('watch', function(){
	gulp.watch('src/html/**/*.html', ['html']);
	gulp.watch('src/script/**/*.js', ['script']);
	gulp.watch('src/style/**/*.scss', ['style']);
});

gulp.task('default', ['html', 'script', 'style']);
