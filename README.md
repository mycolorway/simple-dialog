# Simple Dialog

Simple Dialog 是一个继承自[Simple Module](https://github.com/mycolorway/simple-module)的组件，同时依赖于JQuery。

Simple Dialog导出了simple.dialog对象，借助它之下的方法进行初始化

#### 初始化方法
可以分别借助`dialog` `message` `confirm` 初始化对象，其都有共同的参数：

```
opts = {
    content: [String 需要显示的内容]
    width: [Number 宽度 默认600]
    height: [Number 高度 默认'auto']
    modal: [Boolean 是否有背景遮罩 默认为false]
    clickModalRemove: [Boolean，是否点击遮罩层就退出dialog 默认为true]
    cls: [String 自定义类]
    showRemoveButton: [Boolean 是否显示关闭按钮 默认为true]
    buttons: [Array，包含需要显示的button数组'close']
    focusButton: [Selector 默认focus的按钮 默认".btn:first"]
}
```

####其他方法
同时还有

```
removeAll() 清除所有dialog组件
```
```
setDefaultButton() 设置默认的按钮
```