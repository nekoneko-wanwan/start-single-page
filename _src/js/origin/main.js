$(function(){
/* ---------------------------------------------------- */


/* ----------------------------------------------
 * 変数一覧
 * ----------------------------------------------*/
var controller        = new ScrollMagic();
var $chara = $("#charaPinTrigger");



/* ----------------------------------------------
 * オブジェクト・関数一覧
 * ----------------------------------------------*/
//キャラクターアニメーション
var charaAnimation = {

/*
 * @各アニメーション処理の範囲
 * start[0] < position < end[0] = anim1
 */
    actionPoints : {
        start : [
            1000,
            2000,
            3000
        ],
        end : [
            1500,
            2500,
            3500
        ]
    },

/*
 * @基本的にはclassの付け替えを行う
 * @classでbackground-positionを入れ替えるとかするか
 */
    anim1 : function() {
        console.log('アニメーションその1を実行します');
    },
    anim2 : function() {
        console.log('アニメーションその2を実行します');
    },
    anim3 : function() {
        console.log('アニメーションその3を実行します');
    },
    animDefault : function() {
        console.log('通常のアニメーションを実行します');
    },

/*
 * @どのアニメーションを実行するかチェック
 */
    checkType : function(pos) {
        if ( (this.actionPoints.start[0] < pos) && ( pos < this.actionPoints.end[0]) ) {
            return 'type1';
        } else if ( (this.actionPoints.start[1] < pos) && ( pos < this.actionPoints.end[1]) ) {
            return 'type2';
        } else if ( (this.actionPoints.start[2] < pos) && ( pos < this.actionPoints.end[2]) ) {
            return 'type3';
        } else {
            return 'default';
        }
    },

/*
 * @実行
 */
    play : function(t) {
        var type = this.checkType(t);
        switch(type) {
            case 'type1' :
                this.anim1();
                break;

            case 'type2' :
                this.anim2();
                break;

            case 'type3' :
                this.anim3();
                break;

            default:
                this.animDefault();
                break;
        }
    }
};



/* ----------------------------------------------
 * 初期処理
 * ----------------------------------------------*/
// ナビの固定化
$chara.stick_in_parent({
    sticky_class : 'is_fixed',
    offset_top: 200
});


// スクロールに応じた処理
$(window).exScroll(function(api){
    if((api.getTiming() === 'now' && api.isScrollY()) || (api.getTiming() === 'end' && api.isScrollY()) )  {

        var pos = api.getPosition().top;
        charaAnimation.play(pos);
    }
});



/* ---------------------------------------------------- */
});