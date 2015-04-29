/////////////////////////
// APRENDAQUI GULPFILE //
/////////////////////////

var gulp = require('gulp');
var crypto = require('crypto');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var less = require('gulp-less');
var jade = require('gulp-jade');
var concat = require("gulp-concat");
var clean = require('gulp-clean');
var ngAnnotate = require('gulp-ng-annotate');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var rename = require('gulp-rename');

///////////
// PATHS //
///////////

var components = require('./components.json');
var modules = require('./modules.json');

var source = {
    dir: {
        base: '',
        styles: 'styles/',
        app: 'app/',
        images: 'images/**',
        dist: {
            base: 'dist/',
            app: 'dist/app/',
            styles: 'dist/styles/',
            fonts: 'dist/fonts/',
            images: 'dist/images/'
        }
    },
    ext: {
        index: 'index.html',
        css: 'styles/*.css',
        style: 'styles/style.css',
        less: {
            style: 'styles/style.less',
            all: 'styles/*.less',
            variables: 'styles/variables.less'
        },
        js: 'app/**/*.js',
        html: ['app/**/*.html'],
        jade: ['**/*.jade']
    },
    names: {
        js: crypto.randomBytes(10).toString('hex') + ".js",
        css: crypto.randomBytes(10).toString('hex') + ".css",
        components: {
            js: crypto.randomBytes(10).toString('hex') + ".js",
            css: crypto.randomBytes(10).toString('hex') + ".css"
        }
    },
    modules: modules,
    components: components
};

/////////////////
// BUILD TASKS //
/////////////////

gulp.task('clean-dist', function() {
    return gulp.src(source.dir.dist.base)
        .pipe(clean({
            force: true
        }));
});

gulp.task('less', ['replace-fonts'], function() {
    return gulp.src(source.ext.less.style)
        .pipe(less())
        .pipe(gulp.dest(source.dir.styles));
});

gulp.task('copy-css', ['clean-dist', 'less'], function() {
    return gulp.src(source.ext.style)
        .pipe(gulpif(!argv.dev, minifyCSS({
            processImport: false
        })))
        .pipe(rename(source.names.css))
        .pipe(gulp.dest(source.dir.dist.styles));
});

gulp.task('jade', function() {
    return gulp.src(source.ext.jade)
        .pipe(jade())
        .pipe(gulp.dest(source.dir.base));
});

gulp.task('copy-html', ['clean-dist', 'jade'], function() {
    return gulp.src(source.ext.html)
        .pipe(gulp.dest(source.dir.dist.app));
});

gulp.task('copy-fonts', ['clean-dist'], function() {
    return gulp.src(source.components.fonts)
        .pipe(gulp.dest(source.dir.dist.fonts));
});

gulp.task('copy-images', ['clean-dist'], function() {
    return gulp.src(source.dir.images)
        .pipe(gulp.dest(source.dir.dist.images));
});

gulp.task('replace-fonts', function() {
    return gulp.src(source.ext.less.variables)
        .pipe(gulpif(!argv.dev, replace('../bower_components/bootstrap/fonts/', '../fonts/')))
        .pipe(gulpif(argv.dev, replace('../fonts/', '../bower_components/bootstrap/fonts/')))
        .pipe(gulp.dest(source.dir.styles));
});

gulp.task('html-replace', ['clean-dist', 'copy-html'], function() {
    return gulp.src(source.ext.index)
        .pipe(htmlreplace({
            'js': source.dir.app + source.names.js,
            'css': source.dir.styles + source.names.css,
            'components-js': source.dir.app + source.names.components.js,
            'components-css': source.dir.styles + source.names.components.css
        }))
        .pipe(gulp.dest(source.dir.dist.base));
});

gulp.task('build-js', ['clean-dist'], function() {
    gulp.src(source.modules)
        .pipe(concat(source.names.js))
        .pipe(ngAnnotate())
        .pipe(gulpif(!argv.dev, uglify()))
        .pipe(gulp.dest(source.dir.dist.app));
});

gulp.task('build-components-js', ['clean-dist'], function() {
    gulp.src(source.components.js)
        .pipe(concat(source.names.components.js))
        .pipe(ngAnnotate())
        .pipe(gulpif(!argv.dev, uglify()))
        .pipe(gulp.dest(source.dir.dist.app));
});

gulp.task('build-components-css', ['clean-dist'], function() {
    gulp.src(source.components.css)
        .pipe(concat(source.names.components.css))
        .pipe(gulpif(!argv.dev, minifyCSS()))
        .pipe(gulp.dest(source.dir.dist.styles));
});

///////////
// WATCH //
///////////

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(source.ext.less.all, ['less']);
    gulp.watch([
        source.ext.html,
        source.ext.index,
        source.ext.css,
        source.ext.js
    ]).on('change', function(event) {
        livereload.changed(event.path);
    });
});

gulp.task('build', ['clean-dist', 'replace-fonts', 'less', 'copy-css', 'jade', 'copy-html', 'copy-fonts', 'copy-images', 'html-replace', 'build-js', 'build-components-js', 'build-components-css']);
gulp.task('default', ['jade', 'replace-fonts', 'less', 'watch']);
