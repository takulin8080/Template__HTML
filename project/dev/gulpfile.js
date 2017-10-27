// =================================================================================================
// plugin
// =================================================================================================
var fs = require('fs');
var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var marked = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');
var runSequence = require('run-sequence');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var fontAwesome = require('node-font-awesome');
var $ = require('gulp-load-plugins')();
// =================================================================================================
// setup
// =================================================================================================
var relativePath = true;
var filepath = {
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
	json: {
		src: 'src/_data/**/*.json',
		watch: ['src/_data/**/*.json']
	},
	jsonPost: {
		src: ['src/**/*.md', '!src/styleguide/**/*.md'],
		watch: ['src/**/*.md', '!src/styleguide/**/*.md']
	},
	page: {
		src: ["src/page/**/*.ejs", "!src/page/_**/*", "!src/page/**/_*.ejs"],
		watch: ['src/_data.json', 'src/page/**/*.ejs']
	},
	post: {
		src: 'src/page/',
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
	},
	bsReload: {
		watch: ['dst/**/*']
	}
}
var cleanFile = ['src/_data.json', 'src/_data/_post.json', 'src/common/sass/foundation/_icon.scss', 'src/common/font/icon.*', 'src/common/font/**', 'src/common/sass/foundation/mixin/_icon.scss', 'src/common/sass/component/_icon.scss', 'dst/'];
// =================================================================================================
// json
// =================================================================================================
gulp.task('json', ['jsonData'], function() {
	jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
});
gulp.task('jsonData', ['jsonPost'], function() {
	var src = filepath.json.src;
	var dst = filepath.dst.src;
	return gulp.src(src).pipe($.mergeJson({
		fileName: '_data.json'
	})).pipe(gulp.dest(dst));
});
gulp.task('jsonPost', function() {
	var src = filepath.jsonPost.src;
	var dst = filepath.dst.src + '_data';
	return gulp.src(src).pipe($.util.buffer()).pipe($.markdownToJson(marked, '_post.json')).pipe(gulp.dest(dst));
});
// =================================================================================================
// page
// =================================================================================================
// -----------------------------------------------
// page
// -----------------------------------------------
gulp.task('page', ['pageSetup'], function() {
	var src = filepath.page.src;
	var dst = dstDir;
	var pages = JSON.parse(fs.readFileSync('src/_data.json')).page;
	var posts = JSON.parse(fs.readFileSync('src/_data.json')).post;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('<%= error.message %>')
	})).pipe($.data(function(file) {
		var filename = file.path.replace(/.*page\/(.*)\.ejs/, '$1');
		var parentArray = filename.split('/');
		var hierarchy = ejsHierarchy(parentArray);
		var data = [];
		data['filename'] = filename;
		data['page'] = ejsPages(pages, hierarchy);
		data['post'] = ejsPosts(posts, hierarchy);
		data['path'] = ejsCommon(hierarchy);
		data['ejspath'] = ejsPath(parentArray);
		data['parent'] = ejsParent(parentArray);
		data['site'] = jsonData.site;
		data['contents'] = jsonData.contents;
		data['dev'] = dev;
		Object.assign(data, pages[filename]);
		data = pagedataCheck(data, filename);
		return data;
	})).pipe($.ejs()).pipe($.rename({
		extname: '.html'
	})).pipe($.prettify({
		indent_char: '\t',
		indent_size: 1
	})).pipe(gulp.dest(dst));
});
gulp.task('pageSetup', function() {
	var dst = filepath.dst.src + 'page/';
	var dirname = path.dirname;
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
// -----------------------------------------------
// post
// -----------------------------------------------
gulp.task('post', function() {
	var src = filepath.post.src;
	var dst = dstDir;
	for(var key in jsonData.post) {
		var pages = JSON.parse(fs.readFileSync('src/_data.json')).page;
		var posts = JSON.parse(fs.readFileSync('src/_data.json')).post;
		var data = posts[key];
		var template = data.template;
		var filename = data.filename;
		var parentArray = filename.split('/');
		var hierarchy = ejsHierarchy(parentArray);
		data['filename'] = filename;
		data['page'] = ejsPages(pages, hierarchy);
		data['post'] = ejsPosts(posts, hierarchy);
		data['path'] = ejsCommon(hierarchy);
		data['ejspath'] = ejsPath(parentArray);
		data['parent'] = ejsParent(parentArray);
		data['file'] = filename;
		data['site'] = jsonData.site;
		data['contents'] = jsonData.contents;
		data['dev'] = dev;
		data = postdataCheck(data, filename);
		gulp.src(src + template + ".ejs").pipe($.plumber({
			errorHandler: $.notify.onError('<%= error.message %>')
		})).pipe($.ejs(data)).pipe($.rename(filename + '.html')).pipe($.prettify({
			indent_char: '\t',
			indent_size: 1
		})).pipe($.changed(dst, {
			hasChanged: $.changed.compareSha1Digest
		})).pipe(gulp.dest(dst));
	}
});
// -----------------------------------------------
// function
// -----------------------------------------------
var ejsHierarchy = function(parentArray) {
	if(relativePath) {
		var hierarchy = '';
		if(parentArray.length != 1) {
			for(var key in parentArray) {
				if(key != 0) {
					hierarchy += '../';
				}
			}
		}
	} else {
		var hierarchy = '/';
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
		var filename = post.filename;
		post.url = hierarchy + filename + '.html';
		if(!post.date) {
			post.date = post.updatedAt.replace(/T.*$/, '');
		}
		if(!post.cat) {
			var cat;
			var catArray = filename.split('/');
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
	}
	return posts;
}
var ejsParent = function(parentArray) {
	var filename;
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
				filename = value;
				parents.push(filename + '/index');
			} else if(value == 'index') {
				return parents;
			} else {
				filename += '/' + value;
				parents.push(filename + '/index');
			}
		});
		parents.pop();
		return parents;
	}
}
var ejsCommon = function(hierarchy) {
	var common = {
		css: hierarchy + filepath.common.css,
		img: hierarchy + filepath.common.img,
		js: hierarchy + filepath.common.js
	}
	return common;
}
var ejsPath = function(parentArray) {
	var hierarchy = '';
	if(parentArray.length != 1) {
		for(var key in parentArray) {
			if(key != 0) {
				hierarchy += '../';
			}
		}
	}
	return hierarchy;
}
var pagedataCheck = function(data, filename) {
	var pagedata = data;
	if(!pagedata.description) {
		pagedata.description = jsonData.site.description;
	}
	if(!pagedata.modifier) {
		pagedata.modifier = '';
		var modifierArray = filename.split('/');
		for(var i in modifierArray) {
			pagedata.modifier += modifierArray[i] + ' ';
		}
	}
	return pagedata;
}
var postdataCheck = function(data, filename) {
	var postdata = data;
	if(!postdata.keyword) {
		postdata.keyword = postdata.site.keyword;
	}
	if(!postdata.description) {
		postdata.description = postdata.site.description;
	}
	if(!postdata.date) {
		postdata.date = postdata.updatedAt.replace(/T.*$/, '');
	}
	if(!postdata.modifier) {
		var modifierArray = filename.split('/');
		var modifier = '';
		for(var i in modifierArray) {
			modifier += modifierArray[i] + ' ';
		}
		postdata.modifier = modifier;
	}
	return postdata;
}
// =================================================================================================
// font
// =================================================================================================
// -----------------------------------------------
// icon
// -----------------------------------------------
gulp.task('icon', function() {
	var src = filepath.icon.src;
	var dst = filepath.dst.src + filepath.common.font;
	var fontName = 'icon';
	var template = filepath.dst.src + filepath.common.icon + '_icon.scss';
	var scss = '../sass/component/_icon.scss';
	var fontPath = '../font/'
	return gulp.src(src).pipe($.svgmin()).pipe($.plumber()).pipe($.iconfontCss({
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
	var dst = filepath.dst.dev + filepath.common.font;
	var fontAwewome = [
		fontAwesome.fonts
	];
	return gulp.src(fontAwewome).pipe($.changed(dst)).pipe(gulp.dest(dst));
});
// =================================================================================================
// sass
// =================================================================================================
gulp.task('sass', function() {
	var src = filepath.sass.src;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.sourcemaps.init()).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass({
		includePaths: [
			fontAwesome.scssPath
		]
	})).pipe($.autoprefixer()).pipe($.cleanCss()).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
gulp.task('sassVendor', function() {
	var src = filepath.sass.vendorSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass({
		includePaths: [
			fontAwesome.scssPath
		]
	})).pipe($.autoprefixer()).pipe(gulp.dest(dst));
});
gulp.task('sassFoundation', function() {
	var src = filepath.sass.foundationSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst));
});
gulp.task('sassComponent', function() {
	var src = filepath.sass.componentSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst));
});
gulp.task('sassProject', function() {
	var src = filepath.sass.projectSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst));
});
gulp.task('sassUtility', function() {
	var src = filepath.sass.utilitySrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst));
});
gulp.task('sassDev', function() {
	var src = filepath.sass.devSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer()).pipe(gulp.dest(dst));
});
// =================================================================================================
// styleGuide
// =================================================================================================
gulp.task('styleGuide', function() {
	var src = filepath.styleGuide.src;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.aigis());
});
// =================================================================================================
// js
// =================================================================================================
gulp.task('js', function() {
	var src = filepath.js.src;
	var dst = dstDir + filepath.common.js;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe(webpack(webpackConfig)).pipe(gulp.dest(dst));
});
// =================================================================================================
// img
// =================================================================================================
gulp.task('img', function() {
	var src = filepath.img.src;
	var dst = dstDir + filepath.common.img;
	var imageminOptions = {
		optimizationLevel: 7
	}
	if(imagemin) {
		return gulp.src(src).pipe($.changed(dst)).pipe($.imagemin(imageminOptions)).pipe(gulp.dest(dst));
	} else {
		return gulp.src(src).pipe($.changed(dst)).pipe(gulp.dest(dst));
	}
});
// =================================================================================================
// robots
// =================================================================================================
gulp.task('robots', function() {
	return gulp.src(
		[filepath.dst.src + 'robots.txt'], {
			base: filepath.dst.src
		}).pipe($.changed(filepath.dst.dev)).pipe(gulp.dest(filepath.dst.dev));
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
// -----------------------------------------------
// bsReload
// -----------------------------------------------
gulp.task('bsReload', function() {
	browserSync.reload();
});
// =================================================================================================
// test
// =================================================================================================
gulp.task('test', function() {
	return gulp.src(
		[filepath.dst.dev + filepath.common.font + '**/*', filepath.dst.dev + 'robots.txt'], {
			base: filepath.dst.dev
		}).pipe($.changed(filepath.dst.test)).pipe(gulp.dest(filepath.dst.test));
});
// =================================================================================================
// stage
// =================================================================================================
gulp.task('stage', function() {
	return gulp.src(
		[filepath.dst.test + '**/*', '!' + filepath.dst.test + filepath.common.css + 'app.css.map', '!' + filepath.dst.test + '_dev-sitemap.html'], {
			base: filepath.dst.test
		}).pipe($.changed(filepath.dst.stage)).pipe(gulp.dest(filepath.dst.stage));
});
// =================================================================================================
// prod
// =================================================================================================
gulp.task('prod', ['prodCopy'], function() {
	var jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	return gulp.src(filepath.dst.prod + '**/*.html', {
		read: false
	}).pipe($.sitemap({
		siteUrl: jsonData.site.url
	})).pipe(gulp.dest(filepath.dst.prod));
});
gulp.task('prodCopy', function() {
	return gulp.src(
		[filepath.dst.stage + '**/*', '!' + filepath.dst.stage + 'robots.txt'], {
			base: filepath.dst.stage
		}).pipe($.changed(filepath.dst.prod)).pipe(gulp.dest(filepath.dst.prod));
});
// =================================================================================================
// watch
// =================================================================================================
gulp.task('watch', ['browserSync'], function() {
	gulp.watch(filepath.json.watch, ['json']);
	gulp.watch(filepath.page.watch, ['page']);
	gulp.watch(filepath.post.watch, ['post']);
	gulp.watch(filepath.font.watch, ['font']);
	gulp.watch(filepath.sass.foundationWatch, ['sassFoundation']);
	gulp.watch(filepath.sass.componentWatch, ['sassComponent']);
	gulp.watch(filepath.sass.projectWatch, ['sassProject']);
	gulp.watch(filepath.sass.utilityWatch, ['sassUtility']);
	gulp.watch(filepath.sass.devWatch, ['sassDev']);
	gulp.watch(filepath.styleGuide.watch, ['styleGuide']);
	gulp.watch(filepath.js.watch, ['js']);
	gulp.watch(filepath.img.watch, ['img']);
	gulp.watch(filepath.bsReload.watch, ['bsReload']);
});
// =================================================================================================
// CLEAN
// =================================================================================================
gulp.task('================ CLEAN', function(callback) {
	return del(cleanFile);
});
// =================================================================================================
// BUILD ICON
// =================================================================================================
gulp.task('================ BUILD ICON', ['icon', 'fontAwesome'], function(callback) {
	var src = filepath.font.src;
	var dst = filepath.dst.dev + filepath.common.font;
	return gulp.src(src).pipe($.changed(dst)).pipe(gulp.dest(dst));
});
// =================================================================================================
// DEVELOPMENT
// =================================================================================================
gulp.task('1 ============== DEVELOPMENT', function(callback) {
	dstDir = filepath.dst.dev;
	imagemin = false;
	dev = true;
	runSequence('json', 'robots', 'page', 'post', 'sassVendor', 'sassFoundation', 'sassComponent', 'sassProject', 'sassUtility', 'sassDev', 'styleGuide', 'js', 'img', 'watch', 'browserSync', callback);
});
// =================================================================================================
// TEST
// =================================================================================================
gulp.task('2 ============== TEST', function(callback) {
	dstDir = filepath.dst.test;
	imagemin = true;
	dev = false;
	runSequence('test', 'json', 'page', 'post', 'sass', 'js', 'img', 'test', ', browserSync', callback);
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
