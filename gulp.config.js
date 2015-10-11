module.exports = function () {
    'use strict';
    var src = 'src/';
    var staticDir = 'static/';
    var sass = 'sass/';
    var css = 'styles/';
    var js = 'scripts/';
    var images = 'img/';
    var fonts = 'fonts/';
    var templates = 'templates/';
    var temp = '.tmp/';
    var build = 'build/';
    var config;
    var sassext = '**/*.{scss,sass}';
    var cssext = '**/*.css';
    var jssext = '**/*.js';
    var htmlext = '**/*.html';
    var imgext = '**/*.{jpg,JPG,JPEG,gif,png}';
    var fontext = '**/*.{eot,svg,ttf,woff,woff2,otf}';
    var bowerDir = 'bower_components/';

    config = {
        src: {
            root: src,
            staticDir : src + staticDir,
            sass: [src + staticDir + sass + sassext],
            css: [src + staticDir + css + 'style.css',src + staticDir + css + cssext ],
            cssDir: src + staticDir + css,
            js: [src + staticDir + js + jssext],
            images: [src + staticDir + images + imgext],
            html: src + templates + htmlext,
            htmlDir: src + templates,
            index: src + templates + 'base.html',
            fonts: src + staticDir + bowerDir + fontext,
            json: [src + staticDir + '**/*.json', '!' + src + staticDir + bowerDir + '**']
        },
        build: {
            root: build,
            staticDir : build + staticDir,
            css: build + staticDir + css + cssext,
            cssDir: build + staticDir + css,
            js: build + staticDir + js,
            images: build + staticDir + images,
            htmlDir: build + templates ,
            html: build + templates + htmlext,
            index: build + templates + 'base.html',
            fonts: build + staticDir + fonts
        },
        temp: temp,
        outputRelativePath: '../',
        cdn: 'https://s3-ap-southeast-1.amazonaws.com/91events/',
        bower: {
            json: require('./bower.json'),
            directory: src + staticDir + bowerDir,
            ignorePath: '..'
        },
        serverIP: '0.0.0.0',
        serverPort: '5000'
    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    return config;
};