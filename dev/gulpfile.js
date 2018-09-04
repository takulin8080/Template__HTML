// =================================================================================================
// plugin
// =================================================================================================
var fs = require('fs');
var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var mkdirp = require('mkdirp');
var path = require('path');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackDevConfig = require('./webpack.dev.js');
var webpackProdConfig = require('./webpack.prod.js');
var $ = require('gulp-load-plugins')();
// =================================================================================================
// setup
// =================================================================================================
var relativePath = true;
var filepath = {
	dst: {
		src: 'src/',
		dev: 'dst/',
		release: '../release/'
	},
	common: {
		all: 'common/**/*',
		css: 'common/css/',
		js: 'common/js/',
		img: 'common/img/',
		doc: 'common/doc/',
		font: 'common/font/',
		sass: 'common/sass/',
		icon: 'common/'
	},
	json: {
		src: 'src/_data/**/*.json',
		watch: ['src/_data/**/*.json']
	},
	ejs: {
		src: ['src/ejs/**/*.ejs', '!src/ejs/_**/*', '!src/ejs/**/_*.ejs'],
		releaseSrc: ['src/ejs/**/*.ejs', '!src/ejs/_**/*', '!src/ejs/**/_*.ejs', '!src/ejs/dev/**/*'],
		watch: ['src/_data.json', 'src/**/*.ejs']
	},
	font: {
		src: ['src/common/font/**/*', '!src/common/font/icon.scss'],
		iconSrc: 'src/common/img/icon/*.svg',
		iconDst: 'src/common/font/',
		watch: ['src/common/img/icon/*.svg']
	},
	sass: {
		appSrc: ['src/common/sass/app.scss'],
		vendorSrc: ['src/common/sass/vendor.scss'],
		vendorWatch: ['src/common/sass/vendor/**/*', 'src/common/sass/_variable.scss', ],
		foundationSrc: ['src/common/sass/foundation.scss'],
		foundationWatch: ['src/common/sass/foundation/**/*', 'src/common/sass/_variable.scss', 'src/common/sass/vendor/**/*'],
		componentSrc: ['src/common/sass/component.scss'],
		componentWatch: ['src/common/sass/component/**/*', '!src/common/sass/component/_icon.scss', 'src/common/sass/foundation/**/*', 'src/common/sass/_variable.scss', 'src/common/sass/vendor/**/*'],
		layoutSrc: ['src/common/sass/layout.scss'],
		layoutWatch: ['src/common/sass/layout/**/*', 'src/common/sass/component/**/*', '!src/common/sass/component/_icon.scss', 'src/common/sass/foundation/**/*', 'src/common/sass/_variable.scss', 'src/common/sass/vendor/**/*'],
		moduleSrc: ['src/common/sass/module.scss'],
		moduleWatch: ['src/common/sass/module/**/*', 'src/common/sass/component/**/*', '!src/common/sass/component/_icon.scss', 'src/common/sass/foundation/**/*', 'src/common/sass/_variable.scss', 'src/common/sass/vendor/**/*'],
		scopeSrc: ['src/common/sass/scope.scss'],
		scopeWatch: ['src/common/sass/scope/**/*', 'src/common/sass/component/**/*', '!src/common/sass/component/_icon.scss', 'src/common/sass/foundation/**/*', 'src/common/sass/_variable.scss', 'src/common/sass/vendor/**/*'],
		utilitySrc: ['src/common/sass/utility.scss'],
		utilityWatch: ['src/common/sass/utility/**/*', 'src/common/sass/component/**/*', '!src/common/sass/component/_icon.scss', 'src/common/sass/foundation/**/*', 'src/common/sass/_variable.scss', 'src/common/sass/vendor/**/*'],
	},
	js: {
		src: 'src/common/js/*.js',
		filename: 'bundle.js',
		watch: ['src/common/js/**/*.js']
	},
	img: {
		src: 'src/common/img/**/*.+(jpg|jpeg|png|gif|svg)',
		watch: ['src/common/img/**']
	},
	doc: {
		src: 'src/common/doc/**/*',
		watch: ['src/common/doc/**']
	},
	browserSync: {
		watch: ['dst/**/*']
	}
}
var cleanFile = ['src/_data.json', 'src/common/sass/foundation/_icon.scss', 'src/common/font/icon.*', '!src/common/font/icon.scss', 'src/common/sass/foundation/mixin/_icon.scss', 'dst/', '../release/common/css/utility.css'];
// =================================================================================================
// json
// =================================================================================================
gulp.task('json', ['jsonData'], function() {
	return jsonData = JSON.parse(fs.readFileSync('src/_data.json'));
});
gulp.task('jsonData', function() {
	var src = filepath.json.src;
	var dst = filepath.dst.src;
	return gulp.src(src).pipe($.mergeJson({
		fileName: '_data.json'
	})).pipe(gulp.dest(dst));
});
// =================================================================================================
// html
// =================================================================================================
gulp.task('html', function(cb) {
	runSequence('json', 'fileSetup', 'ejs', cb);
});
// -----------------------------------------------
// fileSetup
// -----------------------------------------------
gulp.task('fileSetup', function() {
	var ejsDst = filepath.dst.src + 'ejs/';
	var sassDst = filepath.dst.src + filepath.common.sass;
	var imgDst = filepath.dst.src + filepath.common.img;
	var dirname = path.dirname;
	if(!dev) {
		var overwritecssDst = filepath.dst.release + filepath.common.css + 'utility.css';
	}

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
	// page
	// ----------------------
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
		// ejs
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
			// utility.css
			if(!dev) {
				var overwritecsscode = jsonData.fileSetup.overwritecsscode.replace(/filename/g, dataPath).replace('modifier', "data-modifier='" + dataName + "'").replace(/(\r\n)/g, '\n');
				appendFile(overwritecssDst, overwritecsscode, function(err) {
					if(err) throw err;
				});
			}
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
			// utility.css
			if(!dev) {
				if(baseModifier != 'dev') {
					var overwritecsscode = jsonData.fileSetup.overwritecsscode.replace(/filename/g, dataPath).replace('modifier', "data-modifier='" + baseModifier + ' ' + dataName + "'").replace(/(\r\n)/g, '\n');
					appendFile(overwritecssDst, overwritecsscode, function(err) {
						if(err) throw err;
					});
				}
			}
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
	// module
	// ----------------------
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
	// layout
	// ----------------------
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
});
// -----------------------------------------------
// ejs
// -----------------------------------------------
gulp.task('ejs', function() {
	if(dev == true) {
		var src = filepath.ejs.src;
	} else {
		var src = filepath.ejs.releaseSrc;
	};
	var dst = dstDir;
	var pages = JSON.parse(fs.readFileSync('src/_data.json')).page;
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
// =================================================================================================
// font
// =================================================================================================
gulp.task('font', ['icon'], function() {
	var src = filepath.font.src;
	var dst = dstDir + filepath.common.font;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.changed(dst)).pipe(gulp.dest(dst));
});
// -----------------------------------------------
// icon
// -----------------------------------------------
gulp.task('icon', function() {
	var src = filepath.font.iconSrc;
	var dst = filepath.font.iconDst;
	var fontName = 'icon';
	var template = filepath.dst.src + filepath.common.icon + '_icon.scss';
	var scss = '../sass/component/_icon.scss';
	var fontPath = '../font/'
	return gulp.src(src).pipe($.svgmin()).pipe($.iconfontCss({
		fontName: fontName,
		path: 'src/common/font/icon.scss',
		targetPath: scss,
		fontPath: fontPath
	})).pipe($.iconfont({
		fontName: fontName,
		formats: ['ttf', 'eot', 'woff', 'svg'],
		appendCodepoints: false
	})).pipe(gulp.dest(dst));
});
// =================================================================================================
// css
// =================================================================================================
gulp.task('css', function() {
	var src = filepath.sass.appSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
		grid: true
	})).pipe($.cleanCss()).pipe(gulp.dest(dst));
});
gulp.task('cssVendor', function() {
	var src = filepath.sass.vendorSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
gulp.task('cssFoundation', function() {
	var src = filepath.sass.foundationSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
		grid: true
	})).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
gulp.task('cssComponent', function() {
	var src = filepath.sass.componentSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
		grid: true
	})).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
gulp.task('cssLayout', function() {
	var src = filepath.sass.layoutSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
		grid: true
	})).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
gulp.task('cssModule', function() {
	var src = filepath.sass.moduleSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
		grid: true
	})).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
gulp.task('cssScope', function() {
	var src = filepath.sass.scopeSrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
		grid: true
	})).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
gulp.task('cssUtility', function() {
	var src = filepath.sass.utilitySrc;
	var dst = dstDir + filepath.common.css;
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe($.sourcemaps.init()).pipe($.sassGlob()).pipe($.sass()).pipe($.autoprefixer({
		grid: true
	})).pipe($.sourcemaps.write('./')).pipe(gulp.dest(dst));
});
// =================================================================================================
// js
// =================================================================================================
gulp.task('js', function() {
	var src = filepath.js.src;
	var dst = dstDir + filepath.common.js;
	if(dev) {
		var webpackConfig = webpackDevConfig;
	} else {
		var webpackConfig = webpackProdConfig;
	}
	return gulp.src(src).pipe($.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})).pipe(webpackStream(webpackConfig, webpack)).pipe(gulp.dest(dst));
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
	if(dev) {
		return gulp.src(src).pipe($.ignore.include({
			isFile: true
		})).pipe($.changed(dst)).pipe(gulp.dest(dst));
	} else {
		return gulp.src(src).pipe($.ignore.include({
			isFile: true
		})).pipe($.changed(dst)).pipe($.imagemin(imageminOptions)).pipe(gulp.dest(dst));
	}
});
// =================================================================================================
// doc
// =================================================================================================
gulp.task('doc', function() {
	var src = filepath.doc.src;
	var dst = dstDir + filepath.common.doc;
	if(dev) {
		return gulp.src(src).pipe($.ignore.include({
			isFile: true
		})).pipe($.changed(dst)).pipe(gulp.dest(dst));
	} else {
		return gulp.src(src).pipe($.ignore.include({
			isFile: true
		})).pipe($.changed(dst)).pipe(gulp.dest(dst));
	}
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
		port: 9000,
		files: filepath.browserSync.watch
	});
});
// =================================================================================================
// watch
// =================================================================================================
gulp.task('watch', function() {
	gulp.watch(filepath.json.watch, ['json']);
	gulp.watch(filepath.ejs.watch, ['html']);
	gulp.watch(filepath.font.watch, ['font']);
	gulp.watch(filepath.sass.vendorWatch, ['cssVendor']);
	gulp.watch(filepath.sass.foundationWatch, ['cssFoundation']);
	gulp.watch(filepath.sass.componentWatch, ['cssComponent']);
	gulp.watch(filepath.sass.layoutWatch, ['cssLayout']);
	gulp.watch(filepath.sass.moduleWatch, ['cssModule']);
	gulp.watch(filepath.sass.scopeWatch, ['cssScope']);
	gulp.watch(filepath.sass.utilityWatch, ['cssUtility']);
	gulp.watch(filepath.js.watch, ['js']);
	gulp.watch(filepath.img.watch, ['img']);
	gulp.watch(filepath.doc.watch, ['doc']);
});
// =================================================================================================
// DEVELOPMENT
// =================================================================================================
gulp.task('1 ============== DEVELOPMENT', function(cb) {
	dstDir = filepath.dst.dev;
	dev = true;
	runSequence('html', 'icon', 'font', 'cssVendor', 'cssFoundation', 'cssComponent', 'cssLayout', 'cssModule', 'cssScope', 'cssUtility', 'js', 'img', 'doc', 'watch', 'browserSync', cb);
});
// =================================================================================================
// RELEASE
// =================================================================================================
gulp.task('2 ============== RELEASE', function(cb) {
	dstDir = filepath.dst.release;
	dev = false;
	runSequence('html', 'font', 'css', 'js', 'img', 'doc', 'browserSync', cb);
});
// =================================================================================================
// CLEAN
// =================================================================================================
gulp.task('X ============== CLEAN', function(cb) {
	return del(cleanFile, {
		force: true
	});
});