#vue-onlySlider-x

Vue的移动端Slider组件。无依赖，功能单一，只有左右滑动功能。如果你需要的仅仅是一个banner，那你可能需要它！

[DEMO 在移动端调试器或移动设备中查看](http://guan6.github.io/vue-onlySlider-x/)

或扫描下面二维码：

![vue-onlySlider-x 二维码](http://guan6.github.io/vue-onlySlider-x/img/code.png)

## 更新历史
2016-02-03 - 修复微信浏览器touchmove不连续触发问题，链接无法点击问题；

## 未解决的问题
iphone6 中的微信浏览器，Transition失效，过渡无动画...你知道为什么吗？tell me （QQ:405171253）


## 测试

运行 `npm install`，来安装所需的依赖模块。

运行 `npm run dev`，启动项目

在浏览器打开 `http://127.0.0.1:9999` 查看效果

## 使用方法

此组件为vue单文件组件，单文件组件使用请参见 [单文件组件](http://cn.vuejs.org/guide/application.html#u5355_u6587_u4EF6_u7EC4_u4EF6)

**组件参数：**

- `items` `array` 滑动对象数组；
- `pagination` `boolean` 是否显示页码标记？默认为 true；
- `auto-play` `boolean` 是否自动播放？默认为 true；
- `speed` `number` 自动播放时间间隔，默认3000，单位毫秒；
- `sync` `boolean` 传入数据是否为同步的？默认为 false，（ajax返回再传入的为异步）；

**`sync` 属性说明**

- 如果用于构造滑动组件的数据是ajax请求后返回的，因为收到返回数据可能在组件内ready事件执行之后，所以此时组件内需要watch数据变化后再初始化
- 如果数据是已经准备好的，则在组件ready时直接初始化，此种情况，请务必在使用组件时，增加 `:sync="true"` 属性，使其直接初始化。

**`items` 数组默认结构**

```javascript
var picList = [
    {picUrl:'1.jpg',href:'/page1/'},
    {picUrl:'2.jpg',href:'/page2/'},
    ...
]
```

**完整的调用示例**

```html
<slider :items="picList" :pagination="true" :auto-play="true" :speed="1000" :sync="true"></slider>
```