# vue-onlySlider-x

- **内含支持`vue1`和`vue2`版本的组件各一个**
- **默认是vue2的组件，vue1的组件相关文件，都放在 `vue1.x`目录中**

Vue的移动端Slider组件。无依赖、功能单一，只有左右滑动功能。如果你需要的仅仅是一个banner，那你可能需要它！

[DEMO 在移动端调试器或移动设备中查看](http://guan6.github.io/vue-onlySlider-x/)

或扫描下面二维码：

![vue-onlySlider-x 二维码](http://guan6.github.io/vue-onlySlider-x/img/code.png)

## 更新历史

2017-03-23 - 增加一个支持`vue2`的版本；

2016-02-17 - 禁止长按图片和链接弹出菜单；

2016-02-17 - 修复一处可能导致该模块无法找到的错误；

2016-02-03 - 修复微信浏览器touchmove不连续触发问题，链接无法点击问题；

## 测试

运行 `npm install`，来安装所需的依赖模块。

运行 `npm run dev`，启动项目

在浏览器打开 `http://127.0.0.1:9999` 查看效果

## 使用方法

此组件为vue单文件组件，单文件组件使用请参见 [单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)

**组件参数：**

- `items` `Array` 图片数组(必选)；
- `pagination` `Boolean` 是否显示页码标记？默认为 true；
- `auto-play` `Boolean` 是否自动播放？默认为 true；
- `speed` `Number` 自动播放时间间隔，默认3000，单位毫秒；
- `sync` `Boolean` 传入数据是否为同步的？默认为 false，（ajax返回再传入的视作异步）；

*VUE2的组件 新增两个参数，都为必选*

- `width` `Number` 单图片真实宽度(单位px，必选)；
- `height` `Number` 单图片真实高度(单位px，必选)；

**`sync` 属性说明**

- 默认为false，为防止组件ready时数据还不存在，初始会在数据有变化后才执行。
- 如果是本地数据，则可以直接初始化，这时请必须添加 `:sync="true"` 属性。

**`items` 数组默认结构**

```javascript
// vue1
var imgs = [
    {picUrl:'1.jpg',href:'/page1/'},
    {picUrl:'2.jpg',href:'/page2/'},
    ...
]

// vue2
var imgs = [
    {src:'1.jpg',href:'/page1/'},
    {src:'2.jpg',href:'/page2/'},
    ...
]
```

**组件示例**

```html
<!-- vue1 -->
<slider :items="imgs" :pagination="true" :auto-play="true" :speed="1000" :sync="true"></slider>

<!-- vue2 -->
<slider :items="imgs" :width="750" :height="300" :pagination="true" :auto-play="true" :speed="1000" :sync="true"></slider>
```


## 联系我

有问题？tell me （QQ:405171253）