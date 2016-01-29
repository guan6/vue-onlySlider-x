#vue-onlySlider-x

Vue的移动端Slider组件

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
<slider :items="picList" :pagination="true" :auto-play="true" :speed="1000"></slider>
```