///** make sure you have installed node, npm , gulp, bower **/
var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({lazy: true});
var del = require('del');
var config = require('./gulp.config')();
var browserSync = require('browser-sync');
var exec = require('child_process').exec;
var runSequence = require('run-sequence');
var revall = require('gulp-rev-all');
var awspublish = require('gulp-awspublish');
var cloudfront = require("gulp-cloudfront");
var port = args.p || config.serverPort;
var host = args.h || config.serverIP;

var aws = {
    "key": "AKIAI67B3JWJNXWRSQJ",
    "secret": "QiIRd0FrrNRjGe6YrHLJYj88ViHx9YDvasO+lNlB",
    "bucket": "91events",
    "region": "us-standard",
    "distributionId": "E1SYAKGEMSK3OD"
};

var publisher = awspublish.create(aws);
var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};
var googlecdn = require('gulp-google-cdn');

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.src.js)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('clean', function (done) {
    log('Cleaning build & temp directories');
    var delconfig = [].concat(config.build.root, config.temp, config.src.cssDir);
    log("Cleaning "  + $.util.colors.blue(delconfig));
    return del(delconfig, done);
});

gulp.task('clean-styles', function (done) {
    log('Cleaning src style directories');
    var delconfig = [].concat(config.src.cssDir);
    log("cleaning "  + $.util.colors.blue(delconfig));
    return del(delconfig, done);
});

gulp.task('sass', function() {
    log('Compiling Sass -->  CSS');
    return gulp.src(config.src.sass)
        .pipe($.plumber())
        .pipe($.sass())
        .pipe(gulp.dest(config.src.cssDir))
        .pipe($.livereload());
});

gulp.task('sass-prod', function() {
    log('Compiling Sass -->  CSS(Compressed)');
    return gulp.src(config.src.sass)
        .pipe($.plumber())
        .pipe($.sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(config.src.cssDir));
});

gulp.task('wiredep', function(){
    log('Initiating wiredep');
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    log(options);
    log('Injecting bower components & custom script');
    return gulp
        .src(config.src.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.src.js),{
                ignorePath: config.src.root
            }))
        .pipe(gulp.dest(config.src.htmlDir));
});

gulp.task('inject', ['wiredep', 'sass'], function(){
    log('Injecting styles and scripts');
    return gulp
        .src(config.src.index)
        .pipe($.inject(gulp.src(config.src.css),{
                ignorePath: config.src.root
            }))
        .pipe(gulp.dest(config.src.htmlDir));
});

gulp.task('fonts', function() {
    log('Copying fonts');
    return gulp
        .src(config.src.fonts)
        .pipe($.rename({dirname: ''}))
        .pipe(gulp.dest(config.build.fonts));
});

gulp.task('images', function (){
   log('Copying and compressing images');
    return gulp
        .src(config.src.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build.images))
});

gulp.task("js", ['vet'], function() {
    log('Initiating vet and live reloading');
    return gulp.src(config.src.js)
        .pipe($.livereload());
});

gulp.task("usemin", ["sass", "js"], function() {
    log('into usemin');
    return gulp.src([config.src.html])
        .pipe($.plumber())
        .pipe($.livereload());
});

gulp.task("usemin-prod", ["sass-prod"], function() {
    return gulp.src(config.src.html)
        .pipe($.plumber())
        .pipe($.usemin({
            assetsDir: config.src.root,
            css: [$.rev()],
            outputRelativePath: config.outputRelativePath,
            html: [$.htmlmin({
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true
            })],
            js: [$.uglify({mangle: false}), $.rev()]
        }))
        .pipe(gulp.dest(config.build.htmlDir));
});

gulp.task('htmlmin', function() {
    log ('** Minifying HTML **');
    return gulp.src(config.src.html)
        .pipe($.htmlmin({
            removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.build.htmlDir));
});


gulp.task('cssmin-local', function() {
    log('** Starting cssmin **');
    return gulp.src(config.src.css)
        .pipe($.livereload())
});

gulp.task('copy-json', function() {
    log('** Copy and minify Json files from Source Static Dir to Build Static Dir');
    return gulp.src(config.src.json)
        .pipe($.jsonminify())
        .pipe(gulp.dest(config.build.staticDir))
});

gulp.task('cfcdn', function () {
    gulp.src(config.build.root + '**')
        .pipe(revall())
        .pipe(awspublish.gzip())
        .pipe(publisher.publish(headers))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())
        .pipe(cloudfront(aws));
});

gulp.task('gcdn', function () {
    return gulp.src(config.src.html)
        .pipe(googlecdn(require('./bower.json')))
        .pipe(gulp.dest(config.build.root));
});

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');
    return gulp.src(config.build.css)
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.build.cssDir));
});

gulp.task('cdnify', function () {
    var cdnify = require('gulp-cdnify');
    return gulp.src([config.src.html])
                .pipe(cdnify({
                    base: config.cdn
                }))
                .pipe(gulp.dest(config.build.root));
});

gulp.task('runserver', function() {
    exec('. venv/bin/activate');
    var proc = exec('python manage.py runserver -h ' + host + ' -p ' + port);
});

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('build:dev', function (callback) {
    log('*************************************************');
    log('*** Your Development Build is getting ready ****');
    log('** Setting dev environment variables ***');
    setenv({CONFIG: 'dev'});
    log('*** Starting build task ****')
    runSequence('clean',
        ['fonts', 'images', 'copy-json'],
        ['inject'],
        ['usemin-prod'],
        ['runserver'],
        callback);
});

gulp.task('build:local', ['sass', 'inject', 'runserver', 'vet'], function () {
    log('--- Initiating ---');
    setenv({CONFIG: 'local'});
    $.livereload.listen({
        port: 35729,
        start: true
    });
    console.info('Livereload on PORT ' + $.livereload.options.port);
    browserSync({
        notify: false,
        proxy: host + ':' + port
    });
    gulp.watch(config.src.sass, ['sass'], $.livereload());
    gulp.watch(config.src.html, ["usemin"]);
    gulp.watch(config.src.js, ["js"]);
    gulp.watch(config.src.css, ["cssmin-local"]);
});

gulp.task('sass-watch', function (){
   gulp.watch(config.src.sass, ['sass'], $.livereload());
});

function setenv(obj) {
    if (typeof (obj) != 'object'){
        errorLogger("Unable to create environment variable");
        log("Send a js object e.g : {CONFIG:'local'}");
        return;
    }
    process.env = obj;
    log('** These variables were set **');
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            $.util.log($.util.colors.red(item + ':' + obj[item]));
        }
    }
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function errorLogger(error){
    log('** Start of the error **');
    log(error);
    log('** End of error **');
    this.emit('end');
}