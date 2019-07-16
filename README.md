# HTML Template gulp
「node + gulp」を利用した『フロントエンド開発（HTML）テンプレート』。

## 更新履歴
- 3.0.0 | 2019.07.16
- 0.0.0 | 3.0.0より前

---

## 本プログラムの機能と目的
フロントエンド開発の経験から、必要となる機能を厳選して採用。  
「トレンドや案件内容」によって、多くの変更を要求されるフロントエンド開発において「アップデート可能な『HTMLテンプレート』」の必要性を感じ、様々な状況に対応可能なテンプレートになることを目的として設計。

サイトを構成する要素を、可能な限り「json」で管理し、制作過程において、意識せずとも「コーディングルール」が厳格なものになるよう設計。

「可視性」と「柔軟性」も意識し、複数人での開発、長期的な管理・運営を実現することを目的としている。

### 「json」管理リスト

#### 主要構成要素

- サイト情報  
/dev/src/_data/_variabble.json
- ページ構成  
/dev/src/_data/page.json
- レイアウト  
/dev/src/_data/_dev/layout.json
- 汎用パーツ  
/dev/src/_data/_dev/module.json

#### 「json-ld / schema.org」専用

- LocalBusiness  
/dev/src/_data/LocalBusiness/*.json
- Organization  
/dev/src/_data/Organization/*.json
- Person  
/dev/src/_data/Person/*.json
- 記事要素（パスおよび内容は「article」としているが「news」などに任意で変更可能）  
/dev/src/_data/article/*.json

#### その他

- 開発用ページ（サイト構成パーツなどの解説）  
/dev/src/_data/_dev/page.json
- 自動出力ファイル用（ejs, scss, imgを生成）  
/dev/src/_data/_dev/file-setup.json
- サンプルテキスト  
/dev/src/_data/_dev/exsample.json

---

## 動作環境
- node version 12.6.0
- npm version 6.10.0

## gulp メインタスク 実行内容

- _run  
開発用の出力ファイルを「『/dev/dst』フォルダ」に生成、プレビュー。
- _release  
本番用の出力ファイルを「『/release』フォルダ」に生成、プレビュー。  
不要ファイルが残さないため、実行時に「『/release』を一時的に削除」される。  
また「『/dev/dst』フォルダ」も合わせて削除」される。
- _clean  
開発時に生成される「開発用ファイル群」を削除。  
不要なファイル（使用していない画像、アイコンなど...）が増えた場合に利用。

---

## バージョン履歴

### 3.0.0

本バージョンより「readme.md」を作成。

#### 動作環境
- node version 12.6.0
- npm version 6.10.0

#### gulp メインタスク 実行内容

- _run  
開発用の出力ファイルを「『/dev/dst』フォルダ」に生成、プレビュー。
- _release  
本番用の出力ファイルを「『/release』フォルダ」に生成、プレビュー。  
不要ファイルを残さないため、実行時に「『/release』フォルダが一時的に削除」される。  
また「『/dev/dst』フォルダ」も合わせて削除」される。
- _clean
開発時に生成される「開発用ファイル群」を削除。  
不要なファイル（使用していない画像、アイコンなど...）が増えた場合に利用。

### 0.0.0 (3.0.0より前)

「readme」なし。使用非推奨。
