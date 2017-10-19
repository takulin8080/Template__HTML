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
var relativePath = true;
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
		src: ['src/**/*.md', '!src/styleguide/**/*.md'],
		watch: ['src/**/*.md', '!src/styleguide/**/*.md']
	},
	devPage: {
		src: 'src/page/dev/**/*.ejs',
		dst: 'dst/dev/',
		watch: ['src/_data.json', 'src/page/**/*.ejs']
	},
	page: {
		src: 'src/page/_template/',
		watch: ['src/_data.json', 'src/page/**/*.ejs', '!src/page/dev/workpage.ejs']
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
		foundationWatch: ['src/common/sass/foundation/**/*', '!src/common/sass/component/_icon.scss'],
		componentSrc: ['src/common/sass/component.scss'],
		componentWatch: ['src/common/sass/foundation/**/*', 'src/common/sass/component/**/*', '!src/common/sass/component/_icon.scss'],
		projectSrc: ['src/common/sass/project.scss'],
		projectWatch: ['src/common/sass/**/*', '!src/common/sass/utility/**/*', '!src/common/sass/component/_icon.scss'],
		utilitySrc: ['src/common/sass/utility.scss'],
		utilityWatch: ['src/common/sass/foundation/**/*', 'src/common/sass/utility/**/*', '!src/common/sass/component/_icon.scss'],
		devSrc: ['src/common/sass/dev.scss'],
		devWatch: ['src/common/sass/dev/**/*', '!src/common/sass/component/_icon.scss']
	},
	styleGuide: {
		src: 'src/styleguide/aigis_config.yml',
		watch: ['dst/common/css/**/*', 'src/styleguide/**/*', '!src/common/sass/component/_icon.scss']
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
var cleanDir = ['src/_data.json', 'src/_data/_post.json', 'src/common/sass/foundation/_icon.scss', 'src/common/font/icon.*', 'src/common/font/**', 'src/common/sass/foundation/mixin/_icon.scss', 'src/common/sass/component/_icon.scss', 'dst/'];
// =================================================================================================
// jsonData
// =================================================================================================
gulp.task('json', ['jsonData'], function() {
	jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	jsonPage = JSON.parse(fs.readFileSync('src/_data.json')).page;
	jsonPost = JSON.parse(fs.readFileSync('src/_data.json')).post;
});
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
// -----------------------------------------------
// page
// -----------------------------------------------
gulp.task('page', ['ejsPageSetup'], function() {
	var src = path.page.src;
	var dst = dstDir;
	for(var key in jsonPage) {
		var data = jsonPage[key];
		var template = data.template;
		var filename = key;
		var pagename = filename;
		var parentArray = pagename.split('/');
		var hierarchy = ejsHierarchy(parentArray);
		data.page = ejsPages(jsonPage, hierarchy);
		data.post = ejsPosts(jsonPost, hierarchy);
		data.path = ejsCommon(hierarchy);
		data.parent = ejsParent(parentArray);;
		data.file = filename;
		data.site = jsonData.site;
		data.contents = jsonData.contents;
		data.dev = dev;
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
gulp.task('ejsPageSetup', function() {
	var src = path.ejsSetup.src;
	var dst = path.dst.src + 'page/';
	var dirname = require("path").dirname;
	for(var key in jsonPage) {
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
// -----------------------------------------------
// post
// -----------------------------------------------
gulp.task('post', function() {
	var src = path.post.src;
	var dst = dstDir;
	for(var key in jsonPost) {
		var data = jsonPost[key];
		var template = data.template;
		var filename = data.pagename;
		var pagename = data.pagename;
		var parentArray = filename.split('/');
		var hierarchy = ejsHierarchy(parentArray);
		data.page = ejsPages(jsonPage, hierarchy);
		data.post = ejsPosts(jsonPost, hierarchy);
		data.path = ejsCommon(hierarchy);
		data.parent = ejsParent(parentArray);
		data.file = filename;
		data.site = jsonData.site;
		data.contents = jsonData.contents;
		data.dev = dev;
		if(!data.keyword) {
			data.keyword = data.site.keyword;
		}
		if(!data.description) {
			data.description = data.site.description;
		}
		if(!data.date) {
			data.date = data.updatedAt.replace(/T.*$/, '');
		}
		if(!data.pageModifier) {
			var pageModifierArray = pagename.split('/');
			var pageModifierName = '';
			for(var i in pageModifierArray) {
				pageModifierName += pageModifierArray[i] + ' ';
			}
			data.pageModifier = pageModifierName;
		}
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
// -----------------------------------------------
// devPage
// -----------------------------------------------
gulp.task('devPage', function() {
	var src = path.devPage.src;
	var dst = path.devPage.dst;
	var data = [];
	if(relativePath) {
		var hierarchy = '/';
	} else {
		var hierarchy = '../';
	}
	data.page = ejsPages(jsonPage, hierarchy);
	data.post = ejsPosts(jsonPost, hierarchy);
	data.path = ejsCommon(hierarchy);
	data.site = jsonData.site;
	data.contents = jsonData.contents;
	gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('<%= error.message %>')
	})).pipe($.ejs(data)).pipe($.rename({
		extname: '.html'
	})).pipe($.prettify({
		indent_char: '\t',
		indent_size: 1
	})).pipe(gulp.dest(dst)).pipe(browserSync.reload({
		stream: true
	}));
});
// -----------------------------------------------
// function
// -----------------------------------------------
var ejsHierarchy = function(parentArray) {
	var hierarchy;
	if(relativePath) {
		hierarchy = '';
		if(parentArray.length != 1) {
			for(var key in parentArray) {
				if(key != 0) {
					hierarchy += '../';
				}
			}
		}
	} else {
		hierarchy = '/';
	}
	return hierarchy;
}
var ejsPages = function(pages, hierarchy) {
	var url;
	for(var key in pages) {
		if(relativePath) {
			url = hierarchy + key + '.html';
		} else {
			url = url.replace('index.html', '');
		}
		pages[key].url = url;
	}
	return pages;
}
var ejsPosts = function(posts, hierarchy) {
	for(var key in posts) {
		var post = posts[key];
		var pagename = post.pagename;
		post.url = hierarchy + pagename + '.html';
		if(!post.date) {
			post.date = post.updatedAt.replace(/T.*$/, '');
		}
		if(!post.cat) {
			var cat;
			var catArray = pagename.split('/');
			if(catArray != 1) {
				for(var catKey in catArray) {
					if(catKey != catArray.length - 1) {
						cat += catArray[catKey] + '/';
					}
				}
				cat = cat.slice(0, -1);
				post.cat = cat;
			}
		}
		posts[pagename] = post;
	}
	return posts;
}
var ejsParent = function(parentArray) {
	var pagename;
	var parents = [];
	if(parentArray.length == 1) {
		if(parentArray == 'index') {
			return parents;
		} else {
			parents.push('index');
			return parents;
		}
	} else {
		parents.push('index');
		parentArray.forEach(function(value, key) {
			if(key == 0) {
				pagename = value;
				parents.push(pagename + '/index');
			} else if(value == 'index') {
				return parents;
			} else {
				pagename += '/' + value;
				parents.push(pagename + '/index');
			}
		});
		parents.pop();
		return parents;
	}
}
var ejsCommon = function(hierarchy) {
	var common = {
		css: hierarchy + path.common.css,
		img: hierarchy + path.common.img,
		js: hierarchy + path.common.js
	}
	return common;
}
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
	if(imagemin) {
		return gulp.src(src).pipe($.changed(dst)).pipe($.imagemin(imageminOptions)).pipe(gulp.dest(dst)).pipe(browserSync.reload({
			stream: true
		}));
	} else {
		return gulp.src(src).pipe($.changed(dst)).pipe(gulp.dest(dst)).pipe(browserSync.reload({
			stream: true
		}));
	}
});
// =================================================================================================
// robots
// =================================================================================================
gulp.task('robots', function() {
	return gulp.src(
		[path.dst.src + 'robots.txt'], {
			base: path.dst.src
		}).pipe($.changed(path.dst.dev)).pipe(gulp.dest(path.dst.dev));
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
			baseDir: dstDir
		},
		open: 'external',
		port: 9000
	});
});
// =================================================================================================
// test
// =================================================================================================
gulp.task('test', function() {
	return gulp.src(
		[path.dst.dev + path.common.font + '**/*', path.dst.dev + 'robots.txt'], {
			base: path.dst.dev
		}).pipe($.changed(path.dst.test)).pipe(gulp.dest(path.dst.test));
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
		[path.dst.stage + '**/*', '!' + path.dst.stage + 'robots.txt'], {
			base: path.dst.stage
		}).pipe($.changed(path.dst.prod)).pipe(gulp.dest(path.dst.prod));
});
// =================================================================================================
// watch
// =================================================================================================
gulp.task('watch', ['browserSync'], function() {
	gulp.watch(path.jsonData.watch, ['jsonData']);
	gulp.watch(path.jsonPost.watch, ['jsonPost']);
	gulp.watch(path.devPage.watch, ['devPage']);
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
	imagemin = false;
	dev = true;
	runSequence('json', 'robots', 'devPage', 'page', 'post', 'font', 'sassVendor', 'sassFoundation', 'sassComponent', 'sassProject', 'sassUtility', 'sassDev', 'styleGuide', 'js', 'img', 'watch', 'browserSync', callback);
});
// =================================================================================================
// DEVELOPMENT__CLEANUP
// =================================================================================================
gulp.task('2 ============== DEVELOPMENT__CLEANUP', function(callback) {
	dstDir = path.dst.dev;
	imagemin = false;
	dev = true;
	runSequence('clean', 'json', 'robots', 'devPage', 'page', 'post', 'font', 'sassVendor', 'sassFoundation', 'sassComponent', 'sassProject', 'sassUtility', 'sassDev', 'styleGuide', 'js', 'img', 'watch', 'browserSync', callback);
});
// =================================================================================================
// TEST
// =================================================================================================
gulp.task('3 ============== TEST', function(callback) {
	dstDir = path.dst.test;
	imagemin = true;
	dev = false;
	runSequence('test', 'json', 'page', 'post', 'sass', 'js', 'img', 'test', 'browserSync', callback);
});
// =================================================================================================
// STAGE
// =================================================================================================
gulp.task('4 ============== STAGING', function(callback) {
	runSequence('stage', callback);
});
// =================================================================================================
// PRODUCTION
// =================================================================================================
gulp.task('5 ============== PRODUCTION', function(callback) {
	runSequence('prod', callback);
});
