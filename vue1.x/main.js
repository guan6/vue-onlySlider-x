var Vue = require('vue');

// slider 数据源
var sliders = [
        {href:'http://cn.vuejs.org/guide/',picUrl:'img/1.png'},
        {href:'http://cn.vuejs.org/api/',picUrl:'img/2.png'},
        {href:'http://cn.vuejs.org/examples/',picUrl:'img/3.png'}
    ];

// 创建实例
new Vue({
	el: '#Slider',
	data: {
    	pics: sliders
	},
	components:{
		// 加载模块
  		"slider":require('./components/slider.vue'),
	}
});