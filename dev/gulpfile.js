// ==============================================================================================
// plugin
// ==============================================================================================
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const mkdirp = require('mkdirp');
const path = require('path');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackDevConfig = require('./webpack.dev.js');
const webpackProdConfig = require('./webpack.prod.js');
// ==============================================================================================
// setting
// ==============================================================================================
const relativePath = true;
const projectUrl = 'https://www.google.co.jp';
// ==============================================================================================
// json
// ==============================================================================================
gulp.task('json', () => {
	const src = 'src/_data/**/*.json';
	const dst = 'src';
	return gulp.src(src).pipe($.mergeJson({
		fileName: '_data.json'
	})).pipe(gulp.dest(dst));
});
// ==============================================================================================
// html
// ==============================================================================================
// function ========================================
const ejsHierarchy = (parentArray) => {
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
		hierarchy = '/';
	}
	return hierarchy;
}
const ejsPages = (pages, hierarchy) => {
	var url;
	var absUrl;
	for(var key in pages) {
		if(relativePath) {
			url = hierarchy + key + '.html';
			absUrl = '/' + key + '.html';
			absUrl = absUrl.replace('index.html', '');
		} else {
			url = '/' + key + '.html';
			url = url.replace('index.html', '');
		}
		pages[key].url = url;
		pages[key].absUrl = absUrl;
	}
	return pages;
}
const ejsParent = (parentArray) => {
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
		parentArray.forEach((value, key) => {
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
const ejsCommon = (hierarchy) => {
	var common = {
		css: hierarchy + 'common/css/',
		img: hierarchy + 'common/img/',
		js: hierarchy + 'common/js/'
	}
	return common;
}
const ejsPath = (parentArray) => {
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
const pagedataCheck = (data, filename) => {
	var pagedata = data;
	if(!pagedata.pageModifier) {
		pagedata.pageModifier = '';
		var pageModifierArray = filename.split('/');
		for(var i in pageModifierArray) {
			if(i != pageModifierArray.length - 1) {
				pagedata.pageModifier += pageModifierArray[i] + ' ';
			} else {
				pagedata.pageModifier += pageModifierArray[i];
			}
		}
	}
	return pagedata;
}
// fileSetup [ejs, sass, img] ========================================
gulp.task('fileSetup', (done) => {
	const jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	const ejsDst = 'src/ejs/';
	const sassDst = 'src/common/sass/';
	const imgDst = 'src/common/img/';
	const dirname = path.dirname;

	function appendFile(path, contents, cb) {
		fs.access(path, function(err) {
			if(err) {
				mkdirp(dirname(path), function(err) {
					if(err) return cb(err)
					fs.appendFileSync(path, contents, cb)
				})
			}
		})
	};

	function appendDir(path, cb) {
		fs.access(path, function(err) {
			if(err) {
				mkdirp(path, function(err) {
					if(err) return cb(err)
				})
			}
		})
	};
	// page ----------------------------------------
	var sassBaseArray = [];
	for(var key in jsonData.page) {
		var dataPath = key;
		var dataPathArray = dataPath.split('/');
		var dataHierarchy = ejsHierarchy(dataPathArray);
		var dataName = dataPathArray[dataPathArray.length - 1];
		var dataDir = '';
		for(var i in dataPathArray) {
			if(i != dataPathArray.length - 1) {
				dataDir += dataPathArray[i] + '/';
			}
		}
		if(sassBaseArray.indexOf(dataDir) == -1) {
			sassBaseArray.push(dataDir);
		}
		// ejs --------------------
		var ejscode = jsonData.fileSetup.ejscode.replace(/filename/g, dataPath).replace(/fileHierarchy/g, ejspath).replace(/(\r\n)/g, '\n');
		appendFile(ejsDst + dataPath + '.ejs', ejscode, function(err) {
			if(err) throw err;
		});
		if(dataPathArray.length == 1) {
			// sass
			var sasscode = jsonData.fileSetup.sasscode.replace(/filename/g, dataPath).replace('modifier', "data-modifier='" + dataName + "'").replace(/(\r\n)/g, '\n');
			appendFile(sassDst + 'scope/_' + dataName + '.scss', sasscode, function(err) {
				if(err) throw err;
			});
		} else {
			var modifierArray = dataPathArray;
			modifierArray.pop();
			var baseModifier = '';
			for(var c in modifierArray) {
				if(c != modifierArray.length - 1) {
					baseModifier += modifierArray[c] + ' ';
				} else {
					baseModifier += modifierArray[c];
				}
			}
			// sass
			var sasscode = jsonData.fileSetup.sasscode.replace(/filename/g, dataPath).replace('modifier', "data-modifier='" + baseModifier + ' ' + dataName + "'").replace(/(\r\n)/g, '\n');
			appendFile(sassDst + 'scope/' + dataDir + '_' + dataName + '.scss', sasscode, function(err) {
				if(err) throw err;
			});
		}
		// img
		appendDir(imgDst + 'scope/' + dataPath, function(err) {
			if(err) throw err;
		});
	}
	for(var i in sassBaseArray) {
		var dataDir = sassBaseArray[i];
		var baseModifier = dataDir.slice(0, -1).replace(/\//g, ' ');
		if(baseModifier) {
			// sass
			var sasscode = jsonData.fileSetup.sasscode.replace(/filename/g, dataDir + 'base').replace('modifier', "data-modifier^='" + baseModifier + "'").replace(/(\r\n)/g, '\n');
			appendFile(sassDst + 'scope/' + dataDir + '_base.scss', sasscode, function(err) {
				if(err) throw err;
			});
		}
	}
	// module ----------------------------------------
	for(var i in jsonData.module) {
		var dataPath = jsonData.module[i];
		var dataPathArray = dataPath.split('/');
		var dataHierarchy = ejsHierarchy(dataPathArray);
		var ejspath = "ejspath = '../" + dataHierarchy + "'";
		ejspath = ejspath.replace('//', '/');
		var classname = dataPath.replace(/\//g, '-');
		// ejs
		var ejscode = jsonData.fileSetup.modEjscode.replace(/filename/g, dataPath).replace(/fileHierarchy/g, ejspath).replace(/classname/g, classname).replace(/(\r\n)/g, '\n');
		appendFile(ejsDst + '_module/' + dataPath + '.ejs', ejscode, function(err) {
			if(err) throw err;
		});
		// sass
		var sasscode = jsonData.fileSetup.modSasscode.replace(/filename/g, dataPath).replace(/classname/g, classname).replace(/(\r\n)/g, '\n');
		appendFile(sassDst + 'module/_' + dataPath + '.scss', sasscode, function(err) {
			if(err) throw err;
		});
		// img
		appendDir(imgDst + 'module/' + dataPath, function(err) {
			if(err) throw err;
		});
	}
	// layout ----------------------------------------
	for(var i in jsonData.layout) {
		var dataPath = jsonData.layout[i];
		var dataPathArray = dataPath.split('/');
		var dataHierarchy = ejsHierarchy(dataPathArray);
		var ejspath = "ejspath = '../" + dataHierarchy + "'";
		ejspath = ejspath.replace('//', '/');
		var tempModifier = dataPath.replace(/\//g, ' ');
		// ejs
		var ejscode = jsonData.fileSetup.layoutEjscode.replace(/filename/g, dataPath).replace(/fileHierarchy/g, ejspath).replace(/(\r\n)/g, '\n');
		appendFile(ejsDst + '_layout/' + dataPath + '.ejs', ejscode, function(err) {
			if(err) throw err;
		});
		// sass
		var sasscode = jsonData.fileSetup.layoutSasscode.replace(/filename/g, dataPath).replace(/tempModifier/g, tempModifier).replace(/(\r\n)/g, '\n');
		appendFile(sassDst + 'layout/_' + dataPath + '.scss', sasscode, function(err) {
			if(err) throw err;
		});
		// img
		appendDir(imgDst + 'layout/' + dataPath, function(err) {
			if(err) throw err;
		});
	}
	done();
});
// ejs ========================================
gulp.task('ejs', () => {
	if(dev == true) {
		var ejsSrc = ['src/ejs/**/*.ejs', '!src/ejs/_**/*', '!src/ejs/**/_*.ejs'];
	} else {
		var ejsSrc = ['src/ejs/**/*.ejs', '!src/ejs/_**/*', '!src/ejs/**/_*.ejs', '!src/ejs/dev/**/*'];
	};
	const src = ejsSrc;
	const dst = dstDir;
	const jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
	const pages = JSON.parse(fs.readFileSync('src/_data.json')).page;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('<%= error.message %>')
	})).pipe($.data(function(file) {
		var filename = file.path.replace(/.*\/ejs\/(.*)\.ejs/, '$1');
		var parentArray = filename.split('/');
		var hierarchy = ejsHierarchy(parentArray);
		var data = [];
		data['filename'] = filename;
		data['page'] = ejsPages(pages, hierarchy);
		data['path'] = ejsCommon(hierarchy);
		data['ejspath'] = ejsPath(parentArray);
		data['parent'] = ejsParent(parentArray);
		data['dev'] = dev;
		var projectData = jsonData;
		delete projectData['page'];
		delete projectData['fileSetup'];
		delete projectData['layout'];
		delete projectData['module'];
		data['data'] = projectData;
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
// html ========================================
gulp.task('html', gulp.series('json', 'fileSetup', 'ejs', (done) => {
	done();
}));
// ==============================================================================================
// sass
// ==============================================================================================
gulp.task('font', () => {
	const src = 'src/common/img/icon/*.svg';
	const dst = 'src/common/font';
	return gulp.src(src).pipe($.imagemin()).pipe($.iconfontCss({
		fontName: 'icon',
		path: 'src/common/font/icon.scss',
		targetPath: '../sass/component/_icon.scss',
		fontPath: '../font/'
	})).pipe($.iconfont({
		fontName: 'icon',
		formats: ['ttf', 'eot', 'woff', 'svg'],
		appendCodepoints: false
	})).pipe(gulp.dest(dst));
});
gulp.task('icon', () => {
	const src = ['src/common/font/**/*', '!src/common/font/icon.scss'];
	const dst = dstDir + 'common/font';
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.changed(dst)).pipe(gulp.dest(dst));
});
gulp.task('sass', gulp.series('font', 'icon', () => {
	const src = ['src/common/sass/**/*.scss', '!src/common/sass/**/_*.scss'];
	const dst = dstDir + 'common/css';
	if(dev) {
		return gulp.src(src).pipe($.plumber({
			errorHandler: $.notify.onError('Error: <%= error.message %>')
		})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
			grid: true
		})).pipe($.cleanCss()).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
	} else {
		return gulp.src(src).pipe($.plumber({
			errorHandler: $.notify.onError('Error: <%= error.message %>')
		})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
			grid: true
		})).pipe($.cleanCss()).pipe(gulp.dest(dst));
	}
}));
// ==============================================================================================
// js
// ==============================================================================================
gulp.task('js', () => {
	const src = 'src/common/js/*.js';
	const dst = dstDir + 'common/js';
	if(dev) {
		var webpackConfig = webpackDevConfig;
	} else {
		var webpackConfig = webpackProdConfig;
	}
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe(webpackStream(webpackConfig, webpack)).pipe(gulp.dest(dst));
});
// ==============================================================================================
// img
// ==============================================================================================
gulp.task('img', () => {
	const src = 'src/common/img/**/*';
	const dst = dstDir + 'common/img';
	const imageminOptions = {
		interlaced: true,
		progressive: true,
		optimizationLevel: 5,
		svgoPlugins: [{
			removeViewBox: true
		}]
	}
	return gulp.src(src).pipe($.ignore.include({
		isFile: true
	})).pipe($.changed(dst)).pipe($.imagemin(imageminOptions)).pipe(gulp.dest(dst));
});
// ==============================================================================================
// doc
// ==============================================================================================
gulp.task('doc', () => {
	const src = 'src/common/doc/**/*';
	const dst = dstDir + 'common/doc';
	return gulp.src(src).pipe($.ignore.include({
		isFile: true
	})).pipe($.changed(dst)).pipe(gulp.dest(dst));
});
// ==============================================================================================
// sitemap
// ==============================================================================================
gulp.task('sitemap', () => {
	const src = '../release/**/*.html';
	const dst = '../release';
	return gulp.src(src, {
		read: false
	}).pipe($.sitemap({
		siteUrl: projectUrl
	})).pipe(gulp.dest(dst));
});
// ==============================================================================================
// watch
// ==============================================================================================
gulp.task('watch', (done) => {
	gulp.watch(['src/_data/**/*.json', 'src/**/*.ejs'], gulp.task('html'));
	gulp.watch(['src/common/sass/**/*.scss', '!src/common/sass/component/_icon.scss'], gulp.task('sass'));
	gulp.watch(['src/common/js/**/*'], gulp.task('js'));
	gulp.watch(['src/common/img/**/*'], gulp.task('img'));
	gulp.watch(['src/common/doc/**/*'], gulp.task('doc'));
	done();
});
// ==============================================================================================
// browserSync
// ==============================================================================================
gulp.task('browserSync', (done) => {
	browserSync({
		server: {
			baseDir: dstDir
		},
		open: 'external',
		port: 9000,
		files: dstDir + '**/*'
	});
	done();
});
// ==============================================================================================
// DEVELOPMENT
// ==============================================================================================
gulp.task('setupDevelopment', (done) => {
	dev = true;
	dstDir = 'dst/';
	done();
});
gulp.task('1 ============== DEVELOPMENT', gulp.series('setupDevelopment', gulp.parallel('html', 'sass', 'js', 'img', 'doc'), 'watch', 'browserSync'), (done) => {
	done();
});
// ==============================================================================================
// RELEASE
// ==============================================================================================
gulp.task('setupRelease', (done) => {
	dev = false;
	dstDir = '../release/';
	done();
});
gulp.task('releaseDel', (done) => {
	del(['dst/_data.json', 'src/common/font/icon.*', '!src/common/font/icon.scss', 'src/common/sass/component/_icon.scss', 'src/common/sass/foundation/mixin/_icon.scss', 'dst', '../releace'], {
		force: true
	});
	done();
});
gulp.task('2 ============== RELEASE', gulp.series('setupRelease', 'releaseDel', gulp.parallel('html', 'sass', 'js', 'img', 'doc'), 'browserSync', 'sitemap'), (done) => {
	done();
});
// ==============================================================================================
// CLEAN
// ==============================================================================================
gulp.task('X ============== CLEAN', (done) => {
	del(['src/_data.json', 'src/common/font/icon.*', '!src/common/font/icon.scss', 'src/common/sass/component/_icon.scss', 'src/common/sass/foundation/mixin/_icon.scss', 'dst'], {
		force: true
	});
	done();
});