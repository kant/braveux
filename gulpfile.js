var gulp = require('gulp');
var p = require('gulp-load-plugins')();

var handle = function(err) {
  console.log(err); this.emit('end');
}

var ftpSetup = function(path) {
  path = path || '';

  return {
    host: 'braveux.com',
    user: process.env.ftp_username,
    pass: process.env.ftp_password,
    remotePath: '/public_html/staging/' + path
  }
}

gulp.task('server', function() {
  return p.connect.server({
    root: 'public',
    port: 8000
  });
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(p.imagemin({progressive: true}))
    .pipe(gulp.dest('public/images'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    // .pipe(p.ftp(ftpSetup('fonts')))
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('ejs', function() {
  return gulp.src('src/views/**/*.ejs')
    .pipe(p.ejs())
    .on('error', handle)
    .pipe(p.htmlmin({collapseWhitespace: true, removeComments: true}))
    .on('error', handle)
    // .pipe(p.ftp(ftpSetup()))
    .pipe(gulp.dest('public'));
});

gulp.task('sass', function() {
  return gulp.src('src/style/style.scss')
    .pipe(p.sass({outputStyle: 'compressed'}))
    .on('error', handle)
    // .pipe(p.ftp(ftpSetup()))
    .pipe(gulp.dest('public'));
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(p.concat('scripts.js'))
    .pipe(p.uglify())
    .on('error', handle)
    // .pipe(p.ftp(ftpSetup()))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/fonts/**/*', ['fonts']);
  gulp.watch('src/views/**/*.ejs', ['ejs']);
  gulp.watch('src/style/*.scss', ['sass']);
  gulp.watch('src/scripts/*.js', ['scripts']);
});

gulp.task('default', [ 'server', 'images', 'fonts', 'ejs', 'sass', 'scripts', 'watch' ]);
