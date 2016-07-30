# Simple Dialog

[![Circle CI](https://circleci.com/gh/mycolorway/simple-dialog.png?style=badge)](https://circleci.com/gh/mycolorway/simple-dialog)
[![Latest Version](https://img.shields.io/npm/v/simple-dialog.svg)](https://www.npmjs.com/package/simple-dialog)
[![Build Status](https://img.shields.io/travis/mycolorway/simple-dialog.svg)](https://travis-ci.org/mycolorway/simple-dialog)
[![Coveralls](https://img.shields.io/coveralls/mycolorway/simple-dialog.svg)](https://coveralls.io/github/mycolorway/simple-dialog)
[![David](https://img.shields.io/david/mycolorway/simple-dialog.svg)](https://david-dm.org/mycolorway/simple-dialog)
[![David](https://img.shields.io/david/dev/mycolorway/simple-dialog.svg)](https://david-dm.org/mycolorway/simple-dialog#info=devDependencies)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/mycolorway/simple-dialog)


A light-weight dialog component.

[Demo](http://mycolorway.github.io/simple-dialog/demo.html)

## Dependencies

- JQuery 3.0+
- [Simple Module 3+](https://github.com/mycolorway/simple-module)

## Compatibility

IE 9+ and all the modern browsers because of the using of CSS transform.

## Usage

Import simple-dialog dependencies and resources:

```html
<link rel="stylesheet" href="path/to/simple-dialog.css" />

<script src="path/to/jquery.min.js"></script>
<script src="path/to/simple-module.js"></script>

<script src="path/to/simple-dialog.js"></script>

```

Get a dialog instance:

```js
var dialog = new SimpleDialog({
  content: "<h4 class=dialog-title>hello dialog</h4><p>this is a demo</p>",
  modal: true
});
```

Meanwhile, there are two shortcuts for you：`SimpleDialog.message` and `SimpleDialog.confirm`

```js
var dialog = SimpleDialog.message({
  content: "hello message",
  modal: true
});

var dialog = SimpleDialog.confirm({
  content: "hello confirm"
});

```

## API

### Options

__content__

String/HtmlString/Element/Array/jQuery, required.

The content displayed on the dialog.

__width__

Number，600 by default.

__modal__

Boolean，false by default.

__fullscreen__

Boolean，false by default.

It's useful on small screen device.

__cls__

String，extra class names for the popover div.

__showRemoveButton__

Boolean，true by default.

Whether to show the remove/close button.

__focusButton__

Selector String，".btn:first" by default.

Which button to focus.

__buttons__

Obejct/Array.

Buttons displayed on the dialog.

For example:

```
{
  text: '42',
  callback: function(e){
		alert('You clicked 42 just now!')
	}
}
```

### Class Methods

__removeAll()__

Destroy all dialogs.

### Instance Methods

__setContent()__

Set the dialog's content.

__remove()__

Destroy the dialog.

### Events

__destroy__

Triggered when a dialog destroys.

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

If everything goes fine, you can see your release at [https://github.com/mycolorway/simple-dialog/releases](https://github.com/mycolorway/simple-dialog/releases). At the End you can publish new version to npm with the command:

```bash
npm publish
```

Please be careful with the last step, because you cannot delete or republish a release on npm.
