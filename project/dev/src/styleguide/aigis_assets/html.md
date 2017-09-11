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
			"template": "index", //利用する`src/_template/*.ejs`を指定（必須）。
			"title": "home", //ページタイトルを指定（必須）。
			"keyword": "", //未設定の場合`site.keyword`が設定される。
			"description": "", //未設定の場合`site.description`が設定される。
			"bodyclass": "home" //`body data-modifier`の値を設定。未設定の場合ファイル名から自動で付与。
		},
		"hoge/index": { //階層を利用する場合、必ず同フォルダ内に`index.html`が必要。
			"template": "default",
			"title": "hoge",
			"keyword": "",
			"description": "",
			"bodyclass": ""
		},
		"hoge/fuga": {
			"template": "default",
			"title": "hoge-fuga",
			"keyword": "",
			"description": "",
			"bodyclass": ""
		}
		...
	}
}
```

#### ejs作成
`ejs`の内容を作成。

```
変数一覧
<%- title %> //タイトル。
<%- keyword %> //ページキーワード。
<%- description %> //ページ解説。
<%- bodyclass %> //ページclass。
<%- url %> //ページURL。
<%- page['ejsファイルパス'].title %> //指定した[ejsファイルパス]のタイトル。
<%- page['ejsファイルパス'].url %> //指定した[ejsファイルパス]のURL。
<%- parent[i].title %> //親ページがある場合のみ対応指定した親のタイトルを表示。
<%- page[i].url %> //親ページがある場合のみ対応指定した親のURLを表示。
<%- site.title %> //サイトタイトル。
<%- site.keyword %> //サイトキーワード。
<%- site.description %> //サイト解説。
<%- site.author %> //サイト制作者。
<%- site.publicationDate %> //公開日。
<%- site.copyright %> //コピーライト。
<%- site.url %> //サイトURL。
<%- img %> //imgフォルダまでのパス。
<%- css %> //cssフォルダまでのパス。
<%- js %> //jsフォルダまでのパス。
```
*/

/*
---
name: Markdown(post)
category: 0-1.HTML
---

`*.md`ファイルを`src/post/**`フォルダ以下に作成し、必須情報を入力することでhtmlが生成される。なお階層対応はしていないため必ず`src/post/**`フォルダ直下に配置すること。`ejs`でのページ変数の利用は`<%- page['category/postname'] %>`または`page.category['postname'] %>`両方で出力が可能。

任意でページ独自の変数を追加することも可能。`例：size: 88cm`

```
---
pagename: cast/sakurako //生成するhtmlパスを設定。併せて階層情報の設定もされるため同階層に`index.html`の設置が必要となる（必須）。
template: post--cast //利用する`src/_template/*.ejs`を指定（必須）。
title: sakurako //ページタイトルを指定（必須）。
tag: //記事のtag。リスト表示の振り分けなどに利用する。
date: 作成日。設定ががない場合、ファイル更新日が表示される。
keyword: //未設定の場合`site.keyword`が設定される。
description: //未設定の場合`site.description`が設定される。
bodyclass: //未設定の場合ファイル名から設定される。
...
---

`markdown`本文

```

```
どちらも同じページのタイトルを出力
<%- page['news/postname'].title %>
<%- post.news['postname'].title %>

```
*/
