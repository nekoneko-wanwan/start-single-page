/*********************************************
 * gulpやプラグインのインポート
 *********************************************/
var _gulp       = require('gulp');
var _webserver  = require('gulp-webserver');
var _livereload = require('gulp-livereload');
var _uglify     = require('gulp-uglify');
var _concat     = require('gulp-concat');
var _jade       = require('gulp-jade');
var _compass    = require('gulp-compass');
var _plumber    = require('gulp-plumber');
var _rimraf     = require('gulp-rimraf');




/*********************************************
 * 変数一覧
 *********************************************/
var path = {
    //開発用
    dev  : {
        scss       : 'scss/**/*.scss',
        coffee     : 'coffee/**/*.coffee',
        js         : {
                        lib           : 'js/lib/*.js',  //pluginをまとめたライブラリ
                        origin        : ['js/origin/*.js', '!js/origin/_*.js'],  //自作のもの(_が付いたものは除外),
                        origin_concat : 'js/origin/_*.js'
        },
        jade       : ['jade/**/*.jade', '!jade/_*/**/*.jade'],  //htmlとして書き出す対象(_partialを除外)
        jade_watch : 'jade/**/*.jade'  //監視する対象
    },
    //公開用
    deploy : {
        root : '../deploy/',
        html : '../deploy/**/*.html',
        css  : '../deploy/common/css/',
        js   : '../deploy/common/js/'
    }
};




/*********************************************
 * webサーバ
 *********************************************/
_gulp.task('webserver', function() {
    _gulp.src(path.deploy.root)  //ルートディレクトリ
    .pipe(_webserver({
        // livereload: false
        //webserverのlivereloadが上手く動作しないため、別途livereloadプラグインを使う
    }));
});




/*********************************************
 * jadeの設定
 *********************************************/
_gulp.task('jade', function() {
    _gulp.src(path.dev.jade)

/*
 * jsonファイルを読み込む場合
 * gulp-dataをインストールし、requireする

    .pipe(_data(function(file) {
        return require('./jade/contents.json');
    }))

 */

    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_jade({
        pretty: true
    }))
    .pipe(_gulp.dest(path.deploy.root))
    .pipe(_livereload({ auto: true }));
});




/*********************************************
 * compassの設定
 *********************************************/
_gulp.task('compass', function() {
    _gulp.src(path.dev.scss)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_compass({
        config_file: 'scss/config.rb',  //compassの設定ファイルの場所
        css: path.deploy.css,  //出力するcssのフォルダ場所
        sass: 'scss'  //sassファイルの場所
    }))
    .pipe(_livereload({ auto: true }));

    //.pipe(_gulp.dest(''));  //他にも出力先を指定する場合
});




/*********************************************
 * coffeeScriptの設定
 *********************************************/
// _gulp.task('coffee', function() {
//     _gulp.src(path.dev.coffee)
//     .pipe(_plumber())  //エラーが出てもwatchを止めない
//     .pipe(_coffee())
//     .pipe(_gulp.dest(path.deploy.js))
//     .pipe(_livereload({ auto: true }));
// });




/*********************************************
 * jsの設定
 *********************************************/
_gulp.task('js-min', function() {
    //pluginの圧縮と結合
    _gulp.src(path.dev.js.lib)
    .pipe(_plumber())                          //エラーが出てもwatchを止めない
    .pipe(_concat('lib.js'))  //結合
    .pipe(_uglify({
        preserveComments:'some'
    }))                           //圧縮
    .pipe(_gulp.dest(path.deploy.js))
    .pipe(_livereload({ auto: true }));

    //自作jsの圧縮（結合しないもの）
    _gulp.src(path.dev.js.origin)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_uglify())   //圧縮
    .pipe(_gulp.dest(path.deploy.js))
    .pipe(_livereload({ auto: true }));

    //自作jsの圧縮と結合
    _gulp.src(path.dev.js.origin_concat)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_concat('script.js') )
    .pipe(_uglify())   //圧縮
    .pipe(_gulp.dest(path.deploy.js))
    .pipe(_livereload({ auto: true }));

});




/*********************************************
 * watchの設定
 *********************************************/
_gulp.task('watch', function() {
    _livereload.listen();

    _gulp.watch(path.dev.jade_watch, ['jade']    );
    _gulp.watch(path.dev.scss,       ['compass'] );
    _gulp.watch([path.dev.js.origin, path.dev.js.origin_concat, path.dev.js.lib], ['js-min'] );
});




/*********************************************
 * 基本実行
 * コマンド -> gulp
 *********************************************/
_gulp.task('default', ['webserver', 'jade', 'compass', 'js-min', 'watch']);




/*********************************************
 * ファイルの削除
 * 
 * コマンド -> gulp del
 *********************************************/
_gulp.task('del', function() {
    return _gulp.src([path.deploy.html, path.deploy.js, path.deploy.css], { read: false }) // much faster
           .pipe(_rimraf({ force: true }));
});





/**
 * [参考]functionでの書き方

    _gulp.task('default', function(){
        _gulp.run('watch', 'copy-html');
    });
*/
