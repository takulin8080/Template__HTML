/*
---
name: Ejs
category: 0-1.HTML
---
### `page.json`設定
`src/_data/page.json`に作成するhtml情報を設定。自動的に`key`に該当する`ejs`ファイルが作成される。`hoge/fuga" → "src/hoge/fuga.ejs"`

任意でページ独自の変数を追加することも可能。`例：size: 88cm`

```json
{
	"page": {
		"index": {
			"template": "home", //各ejsをincludeする際の振り分けなどに利用する（必須）。
			"title": "home", //ページタイトルを指定（必須）。
			"description": "", //未設定の場合`site.description`が設定される。
			"modifier": "home", //`body data-modifier`の値を設定。未設定の場合ファイル名から自動で付与。
			"progress": "done" //`done`, `stop`, `none`を設定可能。`/dev/sitemap`で進捗表示に利用される（入力推奨）。
		},
		"hoge/index": {
			"template": "default",
			"title": "hoge",
			"description": "",
			"modifier": ""
		},
		"hoge/fuga": {
			"template": "default",
			"title": "hoge-fuga",
			"description": "",
			"modifier": ""
		}
		...
	}
}
```

#### ejs作成
`ejs`の内容を作成。

```
変数一覧
<%- url %> //ページURL。
<%- title %> //タイトル。
<%- description %> //ページ解説。
<%- modifier %> //modifier
<%- page['filename'].url %> //指定したページのURL。
<%- page['filename'].title %> //指定したページのタイトル。
<%- page['filename'].description %> //指定したページのdescription。
<%- page['filename'].modifier %> //指定したページのmodifier。
<%- post['filename'].url %> //指定した記事のURL。
<%- post['filename'].title %> //指定した記事のタイトル。
<%- post['filename'].body %> //指定した記事の本文。
<%- post['filename'].description %> //指定したページのdescription。
<%- post['filename'].modifier %> //指定した記事のmodifier。
<%- post['filename'].date %> //指定した記事の作成日。
<%- post['filename'].cat %> //指定した記事のカテゴリー。
<%- post['filename'].tag %> //指定した記事のタグ。
<%- parent[i] %> //親ページがある場合のみ指定可能。親のfilenameを表示。
<%- site.url %> //サイトURL。
<%- site.title %> //サイトタイトル。
<%- site.description %> //サイト解説。
<%- site.author %> //サイト制作者。
<%- site.publicationDate %> //公開日。
<%- site.copyright %> //コピーライト。
<%- path.img %> //imgフォルダまでのパス。
<%- path.css %> //cssフォルダまでのパス。
<%- path.js %> //jsフォルダまでのパス。
<%- ejspath %> //ejsのルートパス。<%- include(ejspath + '_module/**') %>のように使用。
```
*/

/*
---
name: Markdown(post)
category: 0-1.HTML
---

`*.md`ファイルを`src/post/**`フォルダ以下に作成し、必須情報を入力することでhtmlが生成される。`ejs`での記事の利用は`<%- post['filename'] %>で出力が可能。

任意でページ独自の変数を追加することも可能。`例：size: 88cm`

```
---
filename: news/20171212 //生成するhtmlパスを設定。併せて階層情報の設定もされる。
template: news/_post //利用するtemplateを指定。`_template`フォルダ以外のファイルも指定可能だが必ずファイル名の前に`_`を付与する事（必須）。
title: news 20171212 //ページタイトルを指定（必須）。
description: 未設定の場合`site.description`が設定される。
date: 作成日。設定ががない場合、ファイル更新日が表示される。
modifier: 未設定の場合filenameから設定される。
cat: 記事のcategory。
tag: 記事のtag。
...
---

`markdown`本文 //<%- body %>で呼び出し。

```
*/
