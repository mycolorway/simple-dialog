# Simple Dialog

一个简单的组件，用于渲染一个对话框组件。

依赖项：

- JQuery 2.0+
- [Simple Module](https://github.com/mycolorway/simple-module)

### 使用方法
首先，需要在页面里引用相关脚本以及css

```html
<link media="all" rel="stylesheet" type="text/css" href="path/to/dialog.css" />
<script type="text/javascript" src="path/to/jquery.min.js"></script>
<script type="text/javascript" src="path/to/module.js"></script>
<script type="text/javascript" src="path/to/dialog.js"></script>

```

可以通过simple.dialog下的三个方法，实例化dialog组件

```js
simple.dialog({
  content: "<h4 class=dialog-title>hello dialog</h4><p>this is a demo</p>",
  modal: true
});


simple.dialog.message({
  content: "hello message",
  modal: true,
  clickModalRemove: false
});

simple.dialog.confirm({
  content: "hello confirm"
});

```

### API 文档

####初始化选项

__content__

dialog组件需要显示的内容，必选
  
__width__

Number，对话框的宽度，默认600

__modal__

Boolean，是否有遮罩层，默认为false


__clickModalRemove__

Boolean，是否点击遮罩层自动销毁对话框，默认为true

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
  content: [String, 按钮显示的内容],
  callback: [Function，点击按钮触发的回调函数]
}
```

#### 方法

__removeAll()__ 

销毁所有dialog实例

__setDefaultButton()__ Object

设置默认的按钮参数，按钮对象如上定制