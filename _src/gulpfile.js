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
var _sftp       = require("gulp-sftp");



/*********************************************
 * 変数一覧
 *********************************************/
var path = {
    //開発用
    dev  : {
        scss : 'scss/**/*.scss',
        js   : {
            lib           : ['js/lib/*.js', '!js/lib/_concat*.js'],  //plugin単体
            lib_concat    : 'js/lib/_concat*.js',                    //pluginを結合
            origin        : ['js/origin/*.js', '!js/origin/_concat*.js'],  // _concatが付かないものを圧縮するだけ
            origin_concat : 'js/origin/_concat*.js'  // _concatが付いたものは圧縮してさらに結合する
        },
        jade       : ['jade/**/*.jade', '!jade/_*/**/*.jade'],  //htmlとして書き出す対象(_partialを除外)
        jade_watch : 'jade/**/*.jade'  //監視する対象
    },
    //公開用
    deploy : {
        root : '../html/',
        html : '../html/**/*.html',
        css  : '../html/files/css/',
        js   : '../html/files/js/'
    }
};




/*********************************************
 * webサーバ
 *********************************************/
_gulp.task('webserver', function() {
    _gulp.src(path.deploy.root)  //ルートディレクトリ
    .pipe(_webserver({
        port: 8001
        // livereload: false
        //webserverのlivereloadが上手く動作しなかったため、別途livereloadプラグインを使う
    }));
});




/*********************************************
 * jadeの設定
 *********************************************/
_gulp.task('jade', function() {
    _gulp.src(path.dev.jade)
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
 * jsの設定
 *********************************************/
_gulp.task('js-min', function() {
    //pluginをそのままコピー
    _gulp.src(path.dev.js.lib)
    .pipe(_gulp.dest(path.deploy.js + 'lib/'))
    .pipe(_livereload({ auto: true }));

    //pluginの結合（基本的に最初から圧縮されているのを使うので圧縮は不要※必要なライセンス表記を消さないように）
    _gulp.src(path.dev.js.lib_concat)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_concat('lib_concat.js'))  //結合
    .pipe(_gulp.dest(path.deploy.js))
    .pipe(_livereload({ auto: true }));

    //自作jsの圧縮（結合しないもの）
    _gulp.src(path.dev.js.origin)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    // .pipe(_uglify())   //圧縮
    .pipe(_gulp.dest(path.deploy.js))
    .pipe(_livereload({ auto: true }));

    //自作jsの圧縮と結合
    _gulp.src(path.dev.js.origin_concat)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_concat('script.js') )
    // .pipe(_uglify())   //圧縮
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
 * 公開用ディレクトリのhtml, js, cssフォルダの中身を削除
 * 余計なものを消さないように、filesディレクトリ自体とその中の上記以外のものは指定しない
 * コマンド -> gulp del
 *********************************************/
_gulp.task('del', function() {
    return _gulp.src([path.deploy.html, path.deploy.js, path.deploy.css], { read: false }) // much faster
           .pipe(_rimraf({ force: true }));
});



/*********************************************
 * ファイルのアップロード
 * コマンド -> gulp sftp
 *********************************************/
// documentRoot以下を全て送る
_gulp.task('sftp', function() {
  _gulp.src(path.deploy.root + '**')
    .pipe(_sftp({
        host: '',
        port: 22,
        user: 'www',
        pass: '',
        remotePath: '/var/www/html/'
    }));
});


