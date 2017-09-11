// =================================================================================================
// plugin
// =================================================================================================
var fs = require('fs');
var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var marked = require('marked');
var mkdirp = require("mkdirp");
var path = require("path");
var runSequence = require('run-sequence');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var fontAwesome = require('node-font-awesome');
var $ = require('gulp-load-plugins')();
// =================================================================================================
// setup
// =================================================================================================
var dstDir = {
	dev: 'dst/',
	test: '../test/',
	stage: '../stage/',
	prod: '../prod/'
}
var path = {
	dst: {
		src: 'src/',
		dev: 'dst/',
		test: '../test/',
		stage: '../stage/',
		prod: '../prod/'
	},
	common: {
		all: 'common/**/*',
		css: 'common/css/',
		js: 'common/js/',
		img: 'common/img/',
		font: 'common/font/',
		sass: 'common/sass/',
		icon: 'common/icon/'
	},
	jsonData: {
		src: 'src/_data/**/*.json',
		watch: ['src/_data/**/*.json', 'src/page/_data.json', 'src/post/_data.json']
	},
	jsonPost: {
		src: ['src/**/*.md', '!' + 'src/styleguide/**/*.md'],
		watch: ['src/**/*.md', '!' + 'src/styleguide/**/*.md']
	},
	page: {
		src: 'src/page/_template/',
		watch: ['src/_data.json', 'src/page/**/*.ejs']
	},
	ejsSetup: {
		src: 'src/page/_data.json'
	},
	post: {
		src: 'src/page/_template/',
		watch: ['src/_data.json', 'src/**/*.ejs']
	},
	font: {
		src: 'src/common/font/**/*',
		watch: ['src/common/font/**', 'src/common/icon/**']
	},
	icon: {
		src: 'src/common/icon/*.svg'
	},
	sass: {
		src: ['src/common/sass/app.scss'],
		vendorSrc: ['src/common/sass/vendor.scss'],
		foundationSrc: ['src/common/sass/foundation.scss'],
		foundationWatch: ['src/common/sass/foundation/**/*'],
		componentSrc: ['src/common/sass/component.scss'],
		componentWatch: ['src/common/sass/foundation/**/*', 'src/common/sass/component/**/*'],
		projectSrc: ['src/common/sass/project.scss'],
		projectWatch: ['src/common/sass/**/*', '!src/common/sass/component/**/*', '!src/common/sass/utility/**/*'],
		utilitySrc: ['src/common/sass/utility.scss'],
		utilityWatch: ['src/common/sass/foundation/**/*', 'src/common/sass/utility/**/*'],
		devSrc: ['src/common/sass/dev.scss'],
		devWatch: ['src/common/sass/dev/**/*']
	},
	styleGuide: {
		src: 'src/styleguide/aigis_config.yml',
		watch: ['dst/common/css/**/*', 'src/styleguide/**/*']
	},
	js: {
		src: 'src/common/js/*.js',
		watch: ['src/common/js/**/*.js', 'webpack.config.js']
	},
	img: {
		src: 'src/common/img/**/*',
		watch: ['src/common/img/**']
	}
}
var cleanDir = ['src/_data.json', 'src/_data/_post.json', 'src/common/sass/foundation/_icon.scss', 'src/common/font/icon.*', 'src/common/font/uE**', 'src/common/sass/foundation/mixin/_icon.scss', 'src/common/sass/component/_icon.scss', 'dst/'];
// =================================================================================================
// jsonData
// =================================================================================================
gulp.task('jsonData', ['jsonPost'], function() {
	var src = path.jsonData.src;
	var dst = path.dst.src;
	return gulp.src(src).pipe($.mergeJson({
		fileName: '_data.json'
	})).pipe(gulp.dest(dst));
});
gulp.task('jsonPost', function() {
	var src = path.jsonPost.src;
	var dst = path.dst.src + '_data';
	return gulp.src(src).pipe($.util.buffer()).pipe($.markdownToJson(marked, '_post.json')).pipe(gulp.dest(dst));
});
// =================================================================================================
// page
// =================================================================================================
gulp.task('page', ['ejsSetup'], function() {
	var src = path.page.src;
	var dst = dstDir;
	var jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	for(var key in jsonData.page) {
		var data = jsonData.page[key];
		var template = data.template;
		var filename = key;
		var pagename = key;
		var paretnArray = function(file) {
			var parentArray = file.split('/');
			var parentName;
			var parent = [];
			if(parentArray.length == 1) {
				if(parentArray == 'index') {
					return parent;
				} else {
					parent.push('index');
					return parent;
				}
			} else {
				parent.push('index');
				parentArray.forEach(function(value, key) {
					if(key == 0) {
						parentName = value;
						parent.push(parentName + '/index');
					} else if(value == 'index') {
						return parent;
					} else {
						parentName += '/' + value;
						parent.push(parentName + '/index');
					}
				});
				parent.pop();
				return parent;
			}
		}
		data.file = filename;
		data.site = jsonData.site;
		data.path = {
			css: '/' + path.common.css,
			img: '/' + path.common.img,
			js: '/' + path.common.js
		}
		data.url = ('/' + pagename + '.html').replace('index.html', '');
		data.parent = paretnArray(filename);
		if(!data.keyword) {
			data.keyword = data.site.keyword;
		}
		if(!data.description) {
			data.description = data.site.description;
		}
		if(!data.pageModifier) {
			var pageModifierArray = pagename.split('/');
			var pageModifierName = '';
			for(var i in pageModifierArray) {
				pageModifierName += pageModifierArray[i] + ' ';
			}
			data.pageModifier = pageModifierName;
		}
		for(var groupKey in jsonData.post) {
			var postCat = jsonData.post[groupKey];
			for(var postKey in postCat) {
				var post = postCat[postKey];
				post.url = '/' + post.pagename + '.html';
				if(!post.date) {
					post.date = post.updatedAt.replace(/T.*$/, '');
				}
				jsonData.page[post.pagename] = post;
			}
		}
		data.page = jsonData.page;
		data.post = jsonData.post;
		pageData = data.page;
		postData = data.post;
		data.dev = dev;
		gulp.src(src + template + ".ejs").pipe($.plumber({
			errorHandler: $.notify.onError('<%= error.message %>')
		})).pipe($.ejs(data)).pipe($.rename(filename + '.html')).pipe($.prettify({
			indent_char: '\t',
			indent_size: 1
		})).pipe($.changed(dst, {
			hasChanged: $.changed.compareSha1Digest
		})).pipe(gulp.dest(dst)).pipe(browserSync.reload({
			stream: true
		}));
	}
});
gulp.task('ejsSetup', function() {
	var src = path.ejsSetup.src;
	var dst = path.dst.src + 'page/';
	var jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	var dirname = require("path").dirname;
	for(var key in jsonData.page) {
		function appendEjs(path, contents, callback) {
			mkdirp(dirname(path), function(err) {
				if(err) return cb(err)
				fs.appendFileSync(path, contents, callback)
			})
		}
		appendEjs(dst + key + '.ejs', '', function(err) {
			if(err) throw err;
		});
	}
});
gulp.task('post', function() {
	var src = path.post.src;
	var dst = dstDir;
	var jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	for(var groupKey in jsonData.post) {
		var postCat = jsonData.post[groupKey];
		for(var postKey in postCat) {
			var data = postCat[postKey];
			var template = data.template;
			var nameArray = data.pagename.split('/');
			var pagename;
			var parent = ['index'];
			for(var i in nameArray) {
				if(i == 0) {
					pagename = nameArray[i];
				} else {
					pagename += '/' + nameArray[i];
				}
				parent.push(pagename + '/index');
				if(i == nameArray.length - 1) {
					parent.pop();
				}
			}
			filename = pagename;
			data.url = pagename + '.html';
			data.parent = parent;
			data.site = jsonData.site;
			data.path = {
				css: '/' + path.common.css,
				img: '/' + path.common.img,
				js: '/' + path.common.js
			}
			data.page = pageData;
			data.post = postData;
			if(!data.keyword) {
				data.keyword = data.site.keyword;
			}
			if(!data.description) {
				data.description = data.site.description;
			}
			if(!data.pageModifier) {
				var pageModifierArray = pagename.split('/');
				var pageModifierName = '';
				for(var i in pageModifierArray) {
					pageModifierName += pageModifierArray[i] + ' ';
				}
				data.pageModifier = pageModifierName;
			}
			data.dev = dev;
			gulp.src(src + template + ".ejs").pipe($.plumber({
				errorHandler: $.notify.onError('<%= error.message %>')
			})).pipe($.ejs(data)).pipe($.rename(filename + '.html')).pipe($.prettify({
				indent_char: '\t',
				indent_size: 1
			})).pipe($.changed(dst, {
				hasChanged: $.changed.compareSha1Digest
			})).pipe(gulp.dest(dst)).pipe(browserSync.reload({
				stream: true
			}));
		}
	}
});
// =================================================================================================
// font
// =================================================================================================
gulp.task('font', ['icon', 'fontAwesome'], function() {
	var src = path.font.src;
	var dst = dstDir + path.common.font;
	return gulp.src(src).pipe($.changed(dst)).pipe(gulp.dest(dst));
});
// -----------------------------------------------
// icon
// -----------------------------------------------
gulp.task('icon', function() {
	var src = path.icon.src;
	var dst = path.dst.src + path.common.font;
	var fontName = 'icon';
	var template = path.dst.src + path.common.icon + '_icon.scss';
	var scss = '../sass/component/_icon.scss';
	var fontPath = '../font/'
	gulp.src(src).pipe($.svgmin()).pipe($.plumber()).pipe($.iconfontCss({
		fontName: fontName,
		path: 'src/common/icon/_icon.scss',
		targetPath: scss,
		fontPath: fontPath
	})).pipe($.iconfont({
		fontName: fontName,
		formats: ['ttf', 'eot', 'woff', 'svg'],
		appendCodepoints: false
	})).pipe(gulp.dest(dst));
});
// -----------------------------------------------
// fontAwesome
// -----------------------------------------------
gulp.task('fontAwesome', function() {
	var dst = dstDir + path.common.font;
	var fontAwewome = [
		fontAwesome.fonts
	];
	return gulp.src(fontAwewome).pipe($.changed(dst)).pipe(gulp.dest(dst));
});
// =================================================================================================
// sass
// =================================================================================================
gulp.task('sass', function() {
	var src = path.sass.src;
	var dst = dstDir + path.common.css;
	return gulp.src(src).pipe($.sourcemaps.init()).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass({
		includePaths: [
			fontAwesome.scssPath
		]
	})).pipe($.autoprefixer()).pipe($.cleanCss()).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst)).pipe(browserSync.reload({
		stream: true
	}));
});
gulp.task('sassVendor', function() {
	var src = path.sass.vendorSrc;
	var dst = dstDir + path.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass({
		includePaths: [
			fontAwesome.scssPath
		]
	})).pipe($.autoprefixer()).pipe(gulp.dest(dst))
});
gulp.task('sassFoundation', function() {
	var src = path.sass.foundationSrc;
	var dst = dstDir + path.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst))
});
gulp.task('sassComponent', function() {
	var src = path.sass.componentSrc;
	var dst = dstDir + path.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst))
});
gulp.task('sassProject', function() {
	var src = path.sass.projectSrc;
	var dst = dstDir + path.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst))
});
gulp.task('sassUtility', function() {
	var src = path.sass.utilitySrc;
	var dst = dstDir + path.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst))
});
gulp.task('sassDev', function() {
	var src = path.sass.devSrc;
	var dst = dstDir + path.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst))
});
// =================================================================================================
// styleGuide
// =================================================================================================
gulp.task('styleGuide', function() {
	var src = path.styleGuide.src;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.aigis()).pipe(browserSync.reload({
		stream: true
	}));
});
// =================================================================================================
// js
// =================================================================================================
gulp.task('js', function() {
	var src = path.js.src;
	var dst = dstDir + path.common.js;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe(webpack(webpackConfig)).pipe(gulp.dest(dst)).pipe(browserSync.reload({
		stream: true
	}));
});
// =================================================================================================
// img
// =================================================================================================
gulp.task('img', function() {
	var src = path.img.src;
	var dst = dstDir + path.common.img;
	var imageminOptions = {
		optimizationLevel: 7
	}
	return gulp.src(src).pipe($.changed(dst)).pipe($.imagemin(imageminOptions)).pipe(gulp.dest(dst)).pipe(browserSync.reload({
		stream: true
	}));
});
// =================================================================================================
// clean
// =================================================================================================
gulp.task('clean', function() {
	return del(cleanDir);
});
// =================================================================================================
// browserSync
// =================================================================================================
gulp.task('browserSync', function() {
	return browserSync({
		server: {
			baseDir: dstDir,
			index: 'index.html'
		},
		open: 'external',
		port: 9000
	});
});
// =================================================================================================
// stage
// =================================================================================================
gulp.task('stage', function() {
	return gulp.src(
		[path.dst.test + '**/*', '!' + path.dst.test + path.common.css + 'app.css.map', '!' + path.dst.test + '_dev-sitemap.html'], {
			base: path.dst.test
		}).pipe($.changed(path.dst.stage)).pipe(gulp.dest(path.dst.stage));
});
// =================================================================================================
// prod
// =================================================================================================
gulp.task('prod', ['prodCopy'], function() {
	var jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	gulp.src(path.dst.prod + '**/*.html', {
		read: false
	}).pipe($.sitemap({
		siteUrl: jsonData.site.url
	})).pipe(gulp.dest(path.dst.prod));
});
gulp.task('prodCopy', function() {
	return gulp.src(
		[path.dst.stage + '**/*'], {
			base: path.dst.stage
		}).pipe($.changed(path.dst.prod)).pipe(gulp.dest(path.dst.prod));
});
// =================================================================================================
// watch
// =================================================================================================
gulp.task('watch', ['browserSync'], function() {
	gulp.watch(path.jsonData.watch, ['jsonData']);
	gulp.watch(path.jsonPost.watch, ['jsonPost']);
	gulp.watch(path.page.watch, ['page']);
	gulp.watch(path.post.watch, ['post']);
	gulp.watch(path.font.watch, ['font']);
	gulp.watch(path.sass.foundationWatch, ['sassFoundation']);
	gulp.watch(path.sass.componentWatch, ['sassComponent']);
	gulp.watch(path.sass.projectWatch, ['sassProject']);
	gulp.watch(path.sass.utilityWatch, ['sassUtility']);
	gulp.watch(path.sass.devWatch, ['sassDev']);
	gulp.watch(path.styleGuide.watch, ['styleGuide']);
	gulp.watch(path.js.watch, ['js']);
	gulp.watch(path.img.watch, ['img']);
});
// =================================================================================================
// DEVELOPMENT
// =================================================================================================
gulp.task('1 ============== DEVELOPMENT', function(callback) {
	dstDir = path.dst.dev;
	dev = true;
	runSequence('clean', 'jsonData', 'page', 'post', 'font', 'sassVendor', 'sassFoundation', 'sassComponent', 'sassProject', 'sassUtility', 'sassDev', 'styleGuide', 'js', 'img', 'watch', 'browserSync', callback);
});
// =================================================================================================
// TEST
// =================================================================================================
gulp.task('2 ============== TEST', function(callback) {
	dstDir = path.dst.test;
	dev = false;
	runSequence('jsonData', 'page', 'post', 'font', 'sass', 'js', 'img', 'browserSync', callback);
});
// =================================================================================================
// STAGE
// =================================================================================================
gulp.task('3 ============== STAGING', function(callback) {
	runSequence('stage', callback);
});
// =================================================================================================
// PRODUCTION
// =================================================================================================
gulp.task('4 ============== PRODUCTION', function(callback) {
	runSequence('prod', callback);
});
