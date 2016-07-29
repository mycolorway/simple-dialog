# Simple Dialog
[![Circle CI](https://circleci.com/gh/mycolorway/simple-dialog.png?style=badge)](https://circleci.com/gh/mycolorway/simple-dialog)

一个简单的组件，用于渲染一个对话框组件。

依赖项：

- JQuery 2.0+
- [Simple Module](https://github.com/mycolorway/simple-module)

## 使用方法
首先，需要在页面里引用相关脚本以及css

```html
<link media="all" rel="stylesheet" type="text/css" href="path/to/simple-dialog.css" />

<script type="text/javascript" src="path/to/jquery.min.js"></script>
<script type="text/javascript" src="path/to/simple-module.js"></script>

<script type="text/javascript" src="path/to/simple-dialog.js"></script>

```

实例化dialog组件

```js
new SimpleDialog({
  content: "<h4 class=dialog-title>hello dialog</h4><p>this is a demo</p>",
  modal: true
});
```

同时我们提供了两个快捷方式：SimpleDialog.message 和 SimpleDialog.confirm

```js
SimpleDialog.message({
  content: "hello message",
  modal: true
});

SimpleDialog.confirm({
  content: "hello confirm"
});

```

## API 文档

### 初始化选项

__content__

dialog组件需要显示的内容，必选

__width__

Number，对话框的宽度，默认600

__modal__

Boolean，是否有遮罩层，默认为false

__fullscreen__

Boolean，是否全屏，有时手机上需要，默认为 false

__cls__

String，给popover增加自定义的类

__showRemoveButton__

Boolean，设置是否显示关闭按钮，默认为true

__focusButton__

Selector String，设置默认focus的按钮，默认为".btn:first"

__buttons__

Obejct/Array，需要显示哪些按钮，按钮如下定制：

```
{
  text: [String, 按钮显示的内容],
  callback: [Function，点击按钮触发的回调函数]
}
```

### 类方法

__removeAll()__

销毁所有dialog实例

### 实例方法

__setContent()__

设置内容

__remove()__

销毁实例

### 事件

__destroy__

销毁 dialog 实例时触发

```coffeescript
dialog.on 'destroy', ->
  # clean
```

## Development

Clone repository from github:

```bash
git clone https://github.com/mycolorway/simple-dialog.git
```

Install npm dependencies:

```bash
npm install
```

Run default gulp task to build project, which will compile source files, run test and watch file changes for you:

```bash
npm start
```

Now, you are ready to go.

## Publish

If you want to publish new version to npm and bower, please make sure all tests have passed before you publish new version, and you need do these preparations:

* Check the version number in `bower.json` and `package.json`.

* Add new release information in `CHANGELOG.md`. The format of markdown contents will matter, because build scripts will get version and release content from this file by regular expression. You can follow the format of the older release information.

* Put your [personal API tokens](https://github.com/blog/1509-personal-api-tokens) in `/.token`, which is required by the build scripts to request [Github API](https://developer.github.com/v3/) for creating new release.

* Commit changes and push.

Now you can run `gulp publish` task, which will request Github API to create new release.

If everything goes fine, you can see your release at [https://github.com/mycolorway/simple-select/releases](https://github.com/mycolorway/simple-select/releases). At the End you can publish new version to npm with the command:

```bash
npm publish
```

Please be careful with the last step, because you cannot delete or republish a release on npm.
