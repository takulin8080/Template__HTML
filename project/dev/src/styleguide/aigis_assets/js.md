/*
---
name: data-is-active
category: 0-2.JS
tag:
- data属性
---

JSでcssスタイルの変更を行う場合、対象に`data-is-active="$boolean"`を付与し、値の可否でcssスタイルを変更する。基本的にはjsで操作するためのdata属性となっているが、初期値としてhtmlに記載してしまうことも可能。

```scss
.tar[data-is-active~='true'] {
	background: #c0c;
}
```

```html
<div class="tar" data-is-active="true">contents</div>
```
*/

/*
---
name: data-parent
category: 0-2.JS
tag:
- data属性
---
汎用js`data-active, ...`で利用される。詳細は各項の解説を参照。
*/

/*
---
name: data-active
category: 0-2.JS
tag:
- data属性
---
`data-active`を付与することで、`data-is-active`の操作が可能。また、親要素に`data-parent`を付与することで、アクション時に兄弟関係にある`data-active-**`の`data-is-active`を全て`false`にすることが可能。

- `data-active-trg="$string toggle"`クリックで`data-active-tar`および自身の`data-is-active`をtoggle。初期値。
- `data-active-trg="$string add"`クリックで`data-active-tar`の`data-is-active`を`true`に変更。
- `data-active-trg="$string remove"`クリックで`data-active-tar`の`data-is-active`を`false`に変更。
- `data-active-tar="$string"`操作対象コンテンツ。
- `data-parent`親要素となるコンテンツ（任意）。

```html
<dl data-parent>
	<dt data-active-trg="content-a" data-is-active="true">title</dt>
	<dd data-active-tar="content-a" data-is-active="true">contents</dd>
	<dt data-active-trg="content-b">title</dt>
	<dd data-active-tar="content-b">contents</dd>
	<dt data-active-trg="content-c">title</dt>
	<dd data-active-tar="content-c">contents</dd>
</dl>
```
*/
