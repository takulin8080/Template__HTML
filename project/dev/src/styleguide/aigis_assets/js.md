/*
---
name: data-is-active
category: 0-2.JS
tag:
- data
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
name: data-is-parent
category: 0-2.JS
tag:
- data
---
汎用js`data-toggle, data-active, ...`で利用される。詳細は各項の解説を参照。
*/

/*
---
name: data-active
category: 0-2.JS
tag:
- data
---
`data-active`を付与することで、`data-is-active`の操作が可能。また、親要素に`data-is-parent`を付与することで、兄弟関係にある`data-active-**`の`data-is-active`を全て`false`にすることが可能。

- `data-active-trg="$string"`クリックで`data-active-tar`および自身に`data-is-active`を付与。
- `data-active-tar="$string"`toggle対象コンテンツ。
- `data-is-parent`親要素となるコンテンツ（任意）。

```html
<dl data-is-parent>
	<dt data-active-trg="content-a" data-is-active="true">title</dt>
	<dd data-active-tar="content-a" data-is-active="true">contents</dd>
	<dt data-active-trg="content-b">title</dt>
	<dd data-active-tar="content-b">contents</dd>
	<dt data-active-trg="content-c">title</dt>
	<dd data-active-tar="content-c">contents</dd>
</dl>
```
*/

/*
---
name: data-toggle
category: 0-2.JS
tag:
- data
---
`data-toggle`を付与することで、`data-is-active`のtoggle操作が可能。また、親要素に`data-is-parent`を付与することで、兄弟関係にある`data-toggle`の`data-is-active`を全て`false`にすることが可能。

- `data-toggle-trg="$string"`クリックで`data-toggle-tar`および自身に`data-is-active="true"`を付与、もう一度クリックすることで`data-is-active="false"`に設定。
- `data-toggle-tar="$string"`toggle対象コンテンツ。
- `data-is-parent`親要素となるコンテンツ（任意）。

```html
<dl data-is-parent>
	<dt data-toggle-trg="content-a" data-is-active="true">title</dt>
	<dd data-toggle-tar="content-a" data-is-active="true">contents</dd>
	<dt data-toggle-trg="content-b">title</dt>
	<dd data-toggle-tar="content-b">contents</dd>
	<dt data-toggle-trg="content-c">title</dt>
	<dd data-toggle-tar="content-c">contents</dd>
</dl>
```
*/
