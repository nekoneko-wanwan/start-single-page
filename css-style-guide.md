[TOC]

#個人的CSSスタイルガイド案
create: 2014/07/04  
update: 2014/10/14


##はじめに
###このスタイルガイドの目的
* 記述ルールを統一、可視化することでプロジェクトにおけるCSSの拡張性・メンテナンス性の向上を目指す
* ページを構成する要素（UI）をモジュール単位で整理することを意識する


##全体のファイル構成
    -root/
        ├ _src/scss                //開発用
        └ deploy/common/css/*.css  //コンパイルされたcss


##SMACSSとBEMを基本コンセプトとする
###開発用ファイル構成
    -scss/
        ├ component/                    //プロジェクトに関係なく、再利用できる汎用性の高いパターン
        │      ├ _utility-module.scss  //汎用的に使い回すモジュール ※Blockの接頭辞にu-を付与
        │      └ _utility-single.scss  //汎用的に使い回す単体class  ※Blockの接頭辞にu-を付与（乱用注意）
        │
        ├ foundation/                   //プロジェクトの基本的な設定やベースとなる下地をまとめたもの
        │      ├ _compass_prefix.scss  //compassでのprefix設定
        │      ├ _setting.scss         //グローバル変数を設定
        │      ├ _abstract.scss        //グローバル関数・mixinを設定
        │      └ _base.scss            //主に要素セレクタに対する設定
        │
        ├ project/                      //プロジェクトで使用する共通パターン
        │      ├ _layout.scss          //レイアウト（機能がユニークなもの）に対する設定 ※Blockの接頭辞にl-を付与
        │      └ _module.scss          //プロジェクト固有の汎用モジュール ※Blockの接頭辞にm-を付与
        │
        ├ style.scss                    //各スタイルを一括import
        └ *.scss                        //特定のページで使うスタイル ex) -> top.scss ※接頭辞は不要

####補足
* reset.cssはcompass/resetを使用
* モジュール化を検討する目安
    * 別ページで似たコードが _3回_ 以上存在する場合
    * 汎用的なclassを _3つ_ 以上、htmlタグに付与している場合
        * _utility-moduleが沢山ついているのであれば、一つの_moduleや_layoutにまとめられないかと考える


##命名ルール
###IDの使用禁止
* 「IDは機能」「CSSは装飾」と用途別に分別するため、ページ内リンク / jsによるフックなど以外では使用しない
* なお実質ユニークなものである_layoutでもIDは避ける(接頭辞にl-を付与することで衝突を避ける)


###名前の付け方
※もちろん全てタグ名は含めない


####_layout
* 具体的にそのパーツが何を表しているかが分かる _セマンティックな名前_ が望ましい
* .l-topicPath, .l-header, .l-pageContents, .l-mainColumn, .l-paging

####_module
* _moduleは、使い回す事を前提とし、セマンティックを犠牲にしてでも *やや抽象的* にする
* .m-itemList1, .m-headType1, .m-articleList, .m-imgList1, .m-btn

####_utility
* 最小限の粒度を持ち、特定の目的に使用されるパーツのため、機能を端的に表す名前にする
* .u-grid, u-media, u-txtRight, u-mt10, u-btn

####_*.scss
* 特定のページでのみ使用するパーツのため、具体的に何を表しているかが分かる _セマンティックな名前_ が望ましい
* 接頭辞は付けない
* .companyPhoto, .topSlider


###BEM的考え方
* 要素をBlock、Element、Modifierとして整理
    * *ModifierとはBlockまたはElementのバリエーション違いの要素のこと
* Elementはアンダースコア2つ *__* でつなぐ
* Modifierは *is-*、もしくは*has-*を接頭辞としたマルチクラス方式を採用する
* 単語の区切りは キャメルケース でつなぐ
* ex) searchBox > searchBox is-vertical , searchBox__elem


###Elementが入れ子になった場合
* 階層化が明確ではなくなるが、可読性を確保するため、命名上はエレメントを並列にする
* ex) itemをBlock, boxとheadをElementとした場合
* item\__box\__head (✕: NG)
* item\__head (○: OK)


###要素セレクタでの指定
* そのBlock内にて必ず特定のタグを使用する場合は、class名は省略可とする
* li, img, input...など


##実際のscssファイルへの記述方法
### Elementはnestさせないで並列に記述する
    .block {
    }
    .block__element {
      &.is-modifier {  //Element自身のModifier
      }
      .has-modifier & { //BlockのModifierによるElementの変化
      }
    }
* BlockのModifierに対してElementに変化がある場合に親参照ができなく記述が増えてしまうため
* cssも要素セレクタや擬似要素を除き、必要以上の階層化は避ける


##ID,classの記述順
一つのタグにIDや複数classを記述する場合は、先頭から以下を優先順位とする

1. BlockもしくはElement
1. Modifier
1. _utility
1. ID


##その他検討事項
* プロパティの並び順
    * abcアルファベット順
* prefixにはどう対応するか
    * compassモジュールを使用
    * タスクランナーで実行




